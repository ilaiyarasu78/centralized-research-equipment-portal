import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, category, labId, equipmentId, priority, description, imageUrl } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
    }

    const count = await prisma.issue.count();
    const issueNo = `#${1255 + count}`;

    const newIssue = await prisma.issue.create({
      data: {
        issueNo,
        userId,
        labId: labId || null,
        equipmentId: equipmentId || null,
        title,
        category,
        priority: priority || 'MEDIUM',
        status: 'OPEN',
        description,
        imageUrl: imageUrl || null
      },
      include: {
        lab: true,
        equipment: true
      }
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Issue Reported',
        message: `Your issue ticket ${issueNo} ("${title}") was successfully submitted.`,
        type: 'INFO'
      }
    });

    res.status(201).json({ success: true, message: 'Issue reported successfully', data: newIssue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyIssues = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const issues = await prisma.issue.findMany({
      where: { userId },
      include: {
        lab: true,
        equipment: true,
        assignedStaff: { select: { name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, message: 'User issues fetched', data: issues });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { status, priority, category } = req.query;

    const whereClause: any = {};
    if (status && status !== 'ALL') whereClause.status = String(status);
    if (priority && priority !== 'ALL') whereClause.priority = String(priority);
    if (category && category !== 'ALL') whereClause.category = String(category);

    const issues = await prisma.issue.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true, studentProfile: true } },
        lab: true,
        equipment: true,
        assignedStaff: { select: { name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, message: 'All issues fetched', data: issues });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true, studentProfile: true } },
        lab: true,
        equipment: true,
        assignedStaff: { select: { id: true, name: true, avatar: true } },
        comments: {
          include: { user: { select: { id: true, name: true, avatar: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue ticket not found.' });
    }

    res.json({ success: true, message: 'Issue details fetched', data: issue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIssueStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, assignedStaffId } = req.body;

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    const updated = await prisma.issue.update({
      where: { id },
      data: {
        status: status || issue.status,
        resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : issue.resolutionNotes,
        assignedStaffId: assignedStaffId !== undefined ? assignedStaffId : issue.assignedStaffId
      }
    });

    await prisma.notification.create({
      data: {
        userId: issue.userId,
        title: `Issue Ticket ${issue.issueNo} Status Updated`,
        message: `Your reported issue "${issue.title}" is now ${status}.`,
        type: status === 'RESOLVED' ? 'SUCCESS' : 'INFO'
      }
    });

    res.json({ success: true, message: 'Issue ticket updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addIssueComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ success: false, message: 'Comment content is required.' });
    }

    const comment = await prisma.issueComment.create({
      data: {
        issueId: id,
        userId,
        content
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } }
      }
    });

    res.status(201).json({ success: true, message: 'Comment added', data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
