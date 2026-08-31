import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get All Students with Search and Filtering (Admin Portal)
export const getAdminStudents = async (req: AuthRequest, res: Response) => {
  try {
    const { search, department, year, section, status } = req.query;

    const whereClause: any = {
      role: 'STUDENT'
    };

    if (status && typeof status === 'string') {
      whereClause.accountStatus = status.toUpperCase();
    }

    const studentProfileWhere: any = {};

    if (department && typeof department === 'string') {
      studentProfileWhere.department = {
        equals: department,
      };
    }

    if (year && !isNaN(Number(year))) {
      studentProfileWhere.year = Number(year);
    }

    if (section && typeof section === 'string') {
      studentProfileWhere.section = section.toUpperCase();
    }

    if (Object.keys(studentProfileWhere).length > 0) {
      whereClause.studentProfile = studentProfileWhere;
    }

    if (search && typeof search === 'string') {
      const query = search.trim();
      whereClause.AND = [
        ...(whereClause.AND || []),
        {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { studentProfile: { registerNo: { contains: query } } },
            { studentProfile: { department: { contains: query } } }
          ]
        }
      ];
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        accountStatus: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      message: 'Student accounts retrieved directly from database',
      count: students.length,
      data: students
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Detailed Student Profile by ID (Admin)
export const getAdminStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;

    // Search by User ID or Register Number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: studentId },
          { studentProfile: { registerNo: studentId } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        accountStatus: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
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

    if (!user) {
      return res.status(404).json({ success: false, message: 'Student record not found in database.' });
    }

    res.json({
      success: true,
      message: 'Detailed student profile retrieved',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Student Account Status (ACTIVE, INACTIVE, SUSPENDED)
export const updateStudentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value. Must be ACTIVE, INACTIVE, or SUSPENDED.' });
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: studentId },
          { studentProfile: { registerNo: studentId } }
        ]
      }
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: { accountStatus: status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        studentProfile: true
      }
    });

    res.json({
      success: true,
      message: `Student account status updated to ${status}`,
      data: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Admin Student Telemetry Stats
export const getAdminStudentStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const activeStudents = await prisma.user.count({ where: { role: 'STUDENT', accountStatus: 'ACTIVE' } });
    const suspendedStudents = await prisma.user.count({ where: { role: 'STUDENT', accountStatus: 'SUSPENDED' } });
    
    // New students in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    // Breakdown by Department
    const profiles = await prisma.studentProfile.findMany({ select: { department: true } });
    const departmentBreakdown: Record<string, number> = {
      CSE: 0, IT: 0, ECE: 0, EEE: 0, MECH: 0, CIVIL: 0, AIDS: 0, AIML: 0
    };

    profiles.forEach((p) => {
      const dept = (p.department || '').toUpperCase();
      if (departmentBreakdown[dept] !== undefined) {
        departmentBreakdown[dept]++;
      } else {
        departmentBreakdown[dept] = 1;
      }
    });

    res.json({
      success: true,
      message: 'Student telemetry statistics fetched',
      data: {
        totalStudents,
        activeStudents,
        suspendedStudents,
        newStudents,
        departmentBreakdown
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update Student Registration Details (Admin)
export const updateStudentDetails = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const {
      name,
      email,
      registerNo,
      department,
      program,
      year,
      semester,
      section,
      batch,
      admissionYear,
      phone,
      personalEmail,
      academicStatus
    } = req.body;

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: studentId },
          { studentProfile: { registerNo: studentId } }
        ],
        role: 'STUDENT'
      },
      include: { studentProfile: true }
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    if (email && email.toLowerCase() !== targetUser.email.toLowerCase()) {
      const emailExists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use by another account.' });
      }
    }

    if (registerNo && targetUser.studentProfile && registerNo.toLowerCase() !== targetUser.studentProfile.registerNo.toLowerCase()) {
      const regExists = await prisma.studentProfile.findUnique({ where: { registerNo } });
      if (regExists) {
        return res.status(400).json({ success: false, message: 'Register number already in use by another student.' });
      }
    }

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() })
      }
    });

    if (targetUser.studentProfile) {
      await prisma.studentProfile.update({
        where: { id: targetUser.studentProfile.id },
        data: {
          ...(registerNo && { registerNo }),
          ...(department && { department }),
          ...(program && { program }),
          ...(year !== undefined && { year: Number(year) }),
          ...(semester !== undefined && { semester: Number(semester) }),
          ...(section && { section: section.toUpperCase() }),
          ...(batch && { batch }),
          ...(admissionYear !== undefined && { admissionYear: Number(admissionYear) }),
          ...(phone !== undefined && { phone }),
          ...(personalEmail !== undefined && { personalEmail }),
          ...(academicStatus && { academicStatus })
        }
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: targetUser.id },
      include: { studentProfile: true }
    });

    res.json({
      success: true,
      message: 'Student registration details updated successfully.',
      data: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

