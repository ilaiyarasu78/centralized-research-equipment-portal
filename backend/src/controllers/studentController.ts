import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getStudentMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        accountStatus: true,
        createdAt: true,
        studentProfile: true,
        bookings: {
          include: { equipment: true, lab: true },
          orderBy: { createdAt: 'desc' }
        },
        requests: {
          include: { lab: true },
          orderBy: { createdAt: 'desc' }
        },
        issues: {
          include: { lab: true, equipment: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user || user.role !== 'STUDENT') {
      return res.status(403).json({ success: false, message: 'Forbidden. User is not a student.' });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    res.json({
      success: true,
      message: 'Authenticated student profile retrieved',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
