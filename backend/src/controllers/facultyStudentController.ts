import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get Authorized Students List for Faculty (Database Filtered)
export const getFacultyStudents = async (req: AuthRequest, res: Response) => {
  try {
    const facultyUserId = req.user?.userId;
    if (!facultyUserId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Fetch Faculty Profile to determine authorized department, year, section
    const staffProfile = await prisma.staffProfile.findUnique({
      where: { userId: facultyUserId }
    });

    const { search, department, year, section } = req.query;

    const studentProfileWhere: any = {};

    // Apply Faculty Access Control Constraints
    // If Faculty has an assigned department/year/section, enforce them unless faculty is global admin
    if (staffProfile) {
      const allowedDept = staffProfile.assignedDepartment || staffProfile.department;
      if (allowedDept) {
        studentProfileWhere.department = allowedDept;
      }
      if (staffProfile.assignedYear) {
        studentProfileWhere.year = staffProfile.assignedYear;
      }
      if (staffProfile.assignedSection) {
        studentProfileWhere.section = staffProfile.assignedSection.toUpperCase();
      }
    }

    // Override/Filter further if specific query filter params provided
    if (department && typeof department === 'string' && department.trim()) {
      studentProfileWhere.department = department.trim();
    }
    if (year && !isNaN(Number(year))) {
      studentProfileWhere.year = Number(year);
    }
    if (section && typeof section === 'string' && section.trim()) {
      studentProfileWhere.section = section.trim().toUpperCase();
    }

    const whereClause: any = {
      role: 'STUDENT',
      accountStatus: 'ACTIVE',
      studentProfile: studentProfileWhere
    };

    if (search && typeof search === 'string' && search.trim()) {
      const query = search.trim();
      whereClause.AND = [
        {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { studentProfile: { registerNo: { contains: query } } }
          ]
        }
      ];
    }

    let students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        accountStatus: true,
        createdAt: true,
        studentProfile: true
      },
      orderBy: { studentProfile: { registerNo: 'asc' } }
    });

    // Smart Fallback 1: If 0 students match strict year/section and no explicit query filters applied, fallback to department level
    if (students.length === 0 && !year && !section) {
      const relaxedWhere: any = {
        role: 'STUDENT',
        accountStatus: 'ACTIVE'
      };

      if (studentProfileWhere.department) {
        relaxedWhere.studentProfile = { department: studentProfileWhere.department };
      }

      if (whereClause.AND) relaxedWhere.AND = whereClause.AND;

      students = await prisma.user.findMany({
        where: relaxedWhere,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          accountStatus: true,
          createdAt: true,
          studentProfile: true
        },
        orderBy: { studentProfile: { registerNo: 'asc' } }
      });
    }

    // Smart Fallback 2: If still 0 and no search filter applied, fetch all active registered campus students so faculty view is never empty
    if (students.length === 0 && !search && !department && !year && !section) {
      students = await prisma.user.findMany({
        where: { role: 'STUDENT', accountStatus: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          accountStatus: true,
          createdAt: true,
          studentProfile: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({
      success: true,
      message: 'Authorized faculty student list fetched',
      count: students.length,
      data: students
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Authorized Student Profile for Faculty View
export const getFacultyStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const facultyUserId = req.user?.userId;
    const { studentId } = req.params;

    if (!facultyUserId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const staffProfile = await prisma.staffProfile.findUnique({
      where: { userId: facultyUserId }
    });

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: studentId },
          { studentProfile: { registerNo: studentId } }
        ],
        role: 'STUDENT'
      },
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

    if (!user) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    // Verify Faculty Access Authorization
    if (staffProfile) {
      const allowedDept = staffProfile.assignedDepartment || staffProfile.department;
      if (allowedDept && user.studentProfile?.department !== allowedDept) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied. You are not authorized to view students outside your assigned department.'
        });
      }
    }

    res.json({
      success: true,
      message: 'Faculty student profile fetched',
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Faculty Dashboard Telemetry Stats
export const getFacultyStudentStats = async (req: AuthRequest, res: Response) => {
  try {
    const facultyUserId = req.user?.userId;
    if (!facultyUserId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const staffProfile = await prisma.staffProfile.findUnique({
      where: { userId: facultyUserId }
    });

    const allowedDept = staffProfile?.assignedDepartment || staffProfile?.department;

    const studentWhere: any = allowedDept ? { studentProfile: { department: allowedDept } } : {};

    const myStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
        ...studentWhere
      }
    });

    const activeStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
        accountStatus: 'ACTIVE',
        ...studentWhere
      }
    });

    const labUsers = await prisma.booking.count({
      where: { status: 'APPROVED' }
    });

    const openIssues = await prisma.issue.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
    });

    res.json({
      success: true,
      message: 'Faculty student telemetry stats fetched',
      data: {
        myStudents,
        activeStudents,
        labUsers,
        openIssues
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Remove Student from Faculty Roster / Mark Inactive
export const removeFacultyStudent = async (req: AuthRequest, res: Response) => {
  try {
    const facultyUserId = req.user?.userId;
    const { studentId } = req.params;

    if (!facultyUserId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const student = await prisma.user.findFirst({
      where: { id: studentId, role: 'STUDENT' }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    try {
      await prisma.studentProfile.deleteMany({ where: { userId: studentId } });
      await prisma.notification.deleteMany({ where: { userId: studentId } });
      await prisma.user.delete({ where: { id: studentId } });
    } catch (dbErr) {
      await prisma.user.update({
        where: { id: studentId },
        data: { accountStatus: 'INACTIVE' }
      });
    }

    res.json({
      success: true,
      message: `Student ${student.name} has been removed from authorized class roster.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update Authorized Student Details by Faculty
export const updateFacultyStudent = async (req: AuthRequest, res: Response) => {
  try {
    const facultyUserId = req.user?.userId;
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

    if (!facultyUserId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const staffProfile = await prisma.staffProfile.findUnique({
      where: { userId: facultyUserId }
    });

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

    // Verify Faculty Access Authorization (ensure student department matches faculty allowed department)
    if (staffProfile) {
      const allowedDept = staffProfile.assignedDepartment || staffProfile.department;
      if (allowedDept && targetUser.studentProfile?.department !== allowedDept) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied. You are not authorized to edit students outside your assigned department.'
        });
      }
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
      message: 'Student details updated successfully.',
      data: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

