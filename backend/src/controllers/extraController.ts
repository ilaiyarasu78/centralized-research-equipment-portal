import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Campus Locations
export const getCampusLocations = async (req: Request, res: Response) => {
  try {
    const locations = await prisma.campusLocation.findMany({
      include: { lab: true }
    });
    res.json({ success: true, message: 'Campus map locations fetched', data: locations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Announcements
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
      include: { author: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, message: 'Announcements fetched', data: announcements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const authorId = req.user?.userId;
    if (!authorId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, content, category, isImportant } = req.body;
    const item = await prisma.announcement.create({
      data: {
        authorId,
        title,
        content,
        category: category || 'GENERAL',
        isImportant: Boolean(isImportant)
      }
    });

    res.status(201).json({ success: true, message: 'Announcement created', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lost & Found
export const getLostFoundItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.lostFoundItem.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, message: 'Lost & Found items fetched', data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLostFoundItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, category, description, location, date, status, contactInfo, imageUrl } = req.body;

    const item = await prisma.lostFoundItem.create({
      data: {
        userId,
        title,
        category,
        description,
        location,
        date,
        status: status || 'LOST',
        contactInfo,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({ success: true, message: 'Lost/Found item reported', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Feedback
export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { module, rating, comments } = req.body;
    const item = await prisma.feedback.create({
      data: {
        userId,
        module: module || 'General',
        rating: Number(rating) || 5,
        comments: comments || ''
      }
    });

    res.status(201).json({ success: true, message: 'Feedback submitted! Thank you.', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Admin Analytics & Users
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalStaff = await prisma.user.count({ where: { role: 'STAFF' } });
    const totalLabs = await prisma.lab.count();
    const totalEquipment = await prisma.equipment.count();
    const availableEquipment = await prisma.equipment.count({ where: { status: 'AVAILABLE' } });
    const activeBookings = await prisma.booking.count({ where: { status: 'APPROVED' } });
    const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
    const openIssues = await prisma.issue.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } });

    res.json({
      success: true,
      message: 'Admin telemetry stats',
      data: {
        totalStudents,
        totalStaff,
        totalLabs,
        totalEquipment,
        availableEquipment,
        activeBookings,
        pendingBookings,
        openIssues
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        studentProfile: true,
        staffProfile: true,
        adminProfile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, message: 'All users fetched', data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
