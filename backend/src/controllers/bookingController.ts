import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { equipmentId, date, startTime, endTime, purpose, description } = req.body;

    if (!equipmentId || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields (equipment, date, time, purpose).' });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: { lab: true }
    });

    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    if (equipment.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: `Equipment is currently ${equipment.status} and cannot be booked.` });
    }

    // STRICT BOOKING CONFLICT PREVENTION (Section 51 Rule)
    const existingBookings = await prisma.booking.findMany({
      where: {
        equipmentId,
        date,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    const parseTimeMinutes = (timeStr: string): number => {
      const clean = timeStr.trim().toUpperCase();
      let [time, modifier] = clean.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + (minutes || 0);
    };

    const newStart = parseTimeMinutes(startTime);
    const newEnd = parseTimeMinutes(endTime);

    if (newEnd <= newStart) {
      return res.status(400).json({ success: false, message: 'End time must be later than start time.' });
    }

    const conflict = existingBookings.some((b) => {
      const existingStart = parseTimeMinutes(b.startTime);
      const existingEnd = parseTimeMinutes(b.endTime);
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Conflict detected! Equipment is already booked for this overlapping time slot on ' + date
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        equipmentId,
        labId: equipment.labId,
        date,
        startTime,
        endTime,
        purpose,
        description,
        status: 'PENDING'
      },
      include: {
        equipment: true,
        lab: true
      }
    });

    // 1. Send confirmation notification to the student
    await prisma.notification.create({
      data: {
        userId,
        title: 'Permission Request Submitted',
        message: `Your lab booking request for ${equipment.name} on ${date} (${startTime} - ${endTime}) is PENDING Faculty & Admin permission approval.`,
        type: 'INFO'
      }
    });

    // 2. Send notification to all Faculty (STAFF) and Admin (ADMIN) users for permission request
    const staffAndAdmins = await prisma.user.findMany({
      where: { role: { in: ['STAFF', 'ADMIN'] } },
      select: { id: true }
    });

    const studentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    const studentName = studentUser?.name || 'A student';

    for (const recipient of staffAndAdmins) {
      await prisma.notification.create({
        data: {
          userId: recipient.id,
          title: 'New Permission Request',
          message: `${studentName} requested lab booking permission for ${equipment.name} (${equipment.lab.name}) on ${date} (${startTime} - ${endTime}). Permission approval pending.`,
          type: 'WARNING',
          linkUrl: '/staff/dashboard'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking permission request created successfully! Sent for Faculty & Admin approval.',
      data: booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        equipment: true,
        lab: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, message: 'User bookings retrieved', data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, date, labId } = req.query;

    const whereClause: any = {};
    if (status && status !== 'ALL') whereClause.status = String(status);
    if (date) whereClause.date = String(date);
    if (labId) whereClause.labId = String(labId);

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true, studentProfile: true } },
        equipment: true,
        lab: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, message: 'All bookings fetched', data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { equipment: true }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        rejectionReason: rejectionReason || null
      }
    });

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: `Booking ${status}`,
        message: `Your booking for ${booking.equipment.name} on ${booking.date} has been marked as ${status}.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
        type: status === 'APPROVED' ? 'SUCCESS' : status === 'REJECTED' ? 'WARNING' : 'INFO'
      }
    });

    res.json({ success: true, message: `Booking status updated to ${status}`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
