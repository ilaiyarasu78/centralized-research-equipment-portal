import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authMiddleware';

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      fullName,
      registerNo,
      registerNumber,
      email,
      collegeEmail,
      personalEmail,
      department,
      program,
      year,
      semester,
      section,
      batch,
      admissionYear,
      phone,
      password,
      confirmPassword,
      role = 'STUDENT'
    } = req.body;

    const studentName = (fullName || name || '').trim();
    const cleanRegNo = (registerNumber || registerNo || '').trim();
    const cleanEmail = (collegeEmail || email || '').trim().toLowerCase();

    if (!studentName || !cleanRegNo || !cleanEmail || !password || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Register Number, Email, Department, Year, and Password are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.'
      });
    }

    // Email Uniqueness Check
    const existingUser = await prisma.user.findFirst({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (role === 'STAFF') {
      const position = req.body.position || 'Assistant Professor';
      const assignedDepartment = req.body.assignedDepartment || department || 'CSE';
      const assignedYear = Number(req.body.assignedYear || req.body.year || 3);
      const assignedSection = (req.body.assignedSection || req.body.section || 'A').toUpperCase();

      const existingStaff = await prisma.staffProfile.findFirst({ where: { employeeId: cleanRegNo } });
      if (existingStaff) {
        return res.status(400).json({ success: false, message: 'Faculty member with this Employee ID already exists.' });
      }

      const newUser = await prisma.user.create({
        data: {
          name: studentName,
          email: cleanEmail,
          password: passwordHash,
          role: 'STAFF',
          accountStatus: 'ACTIVE',
          staffProfile: {
            create: {
              employeeId: cleanRegNo,
              department: department || 'Information Technology',
              phone: phone || null,
              position: position,
              assignedDepartment: assignedDepartment,
              assignedYear: assignedYear,
              assignedSection: assignedSection
            }
          }
        },
        include: { staffProfile: true }
      });

      const token = generateToken({
        userId: newUser.id,
        role: newUser.role,
        email: newUser.email
      });

      const userObj = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        employeeId: newUser.staffProfile?.employeeId,
        department: newUser.staffProfile?.department,
        position: newUser.staffProfile?.position,
        assignedDepartment: newUser.staffProfile?.assignedDepartment,
        assignedYear: newUser.staffProfile?.assignedYear,
        assignedSection: newUser.staffProfile?.assignedSection,
        accountStatus: newUser.accountStatus,
        phone: newUser.staffProfile?.phone || null
      };

      return res.status(201).json({
        success: true,
        message: 'Faculty account registered successfully!',
        data: { token, user: userObj }
      });
    }

    // STUDENT Registration
    const existingProfile = await prisma.studentProfile.findFirst({
      where: {
        OR: [
          { registerNo: cleanRegNo },
          { registerNo: cleanRegNo.toLowerCase() },
          { registerNo: cleanRegNo.toUpperCase() }
        ]
      }
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Student with this register number already exists.'
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name: studentName,
        email: cleanEmail,
        password: passwordHash,
        role: 'STUDENT',
        accountStatus: 'ACTIVE',
        studentProfile: {
          create: {
            registerNo: cleanRegNo,
            department: department,
            program: program || 'B.E.',
            year: Number(year) || 1,
            semester: Number(semester) || 1,
            section: (section || 'A').toUpperCase(),
            batch: batch || '2024-2028',
            admissionYear: Number(admissionYear) || 2024,
            phone: phone || null,
            personalEmail: personalEmail || null,
            college: 'Karpagam Institute of Technology',
            academicStatus: 'REGULAR'
          }
        }
      },
      include: {
        studentProfile: true
      }
    });

    // Create Admin Notification automatically
    const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
    if (adminUsers.length > 0) {
      await prisma.notification.createMany({
        data: adminUsers.map((a) => ({
          userId: a.id,
          title: 'New Student Registered',
          message: `${studentName} (Register Number: ${cleanRegNo}) from ${department} has successfully registered on the Smart Campus portal.`,
          type: 'INFO',
          linkUrl: `/admin/students/${newUser.id}`
        }))
      });
    }

    // Notify Relevant Faculty (same department or assigned class)
    const facultyUsers = await prisma.staffProfile.findMany({
      where: {
        OR: [
          { department: department },
          { assignedDepartment: department }
        ]
      },
      select: { userId: true }
    });

    if (facultyUsers.length > 0) {
      await prisma.notification.createMany({
        data: facultyUsers.map((f) => ({
          userId: f.userId,
          title: 'New Student Added',
          message: `${studentName} (${cleanRegNo}, ${department} — ${year}th Year — Section ${section || 'A'}) has registered on Smart Campus.`,
          type: 'INFO',
          linkUrl: `/faculty/students/${newUser.id}`
        }))
      });
    }

    const token = generateToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email
    });

    const userObj = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      accountStatus: newUser.accountStatus,
      registerNo: newUser.studentProfile?.registerNo,
      department: newUser.studentProfile?.department,
      program: newUser.studentProfile?.program,
      year: newUser.studentProfile?.year,
      semester: newUser.studentProfile?.semester,
      section: newUser.studentProfile?.section,
      batch: newUser.studentProfile?.batch,
      admissionYear: newUser.studentProfile?.admissionYear,
      college: newUser.studentProfile?.college,
      phone: newUser.studentProfile?.phone || null
    };

    return res.status(201).json({
      success: true,
      message: 'Registration Successful! Your Smart Campus account has been created successfully.',
      data: { token, user: userObj }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { registerNo, registerNumber, password } = req.body;
    const cleanRegNo = (registerNumber || registerNo || '').trim();

    if (!cleanRegNo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Register Number and password are required.'
      });
    }

    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        OR: [
          { registerNo: cleanRegNo },
          { registerNo: cleanRegNo.toLowerCase() },
          { registerNo: cleanRegNo.toUpperCase() }
        ]
      },
      include: { user: true }
    });

    if (!studentProfile || !studentProfile.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Register Number or password.'
      });
    }

    // Account Status Check
    if (studentProfile.user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, studentProfile.user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Register Number or password.'
      });
    }

    // Update lastLoginAt timestamp
    await prisma.user.update({
      where: { id: studentProfile.user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = generateToken({
      userId: studentProfile.user.id,
      role: studentProfile.user.role,
      email: studentProfile.user.email
    });

    const userObj = {
      id: studentProfile.user.id,
      name: studentProfile.user.name,
      email: studentProfile.user.email,
      role: studentProfile.user.role,
      accountStatus: studentProfile.user.accountStatus,
      avatar: studentProfile.user.avatar,
      registerNo: studentProfile.registerNo,
      department: studentProfile.department,
      program: studentProfile.program,
      year: studentProfile.year,
      semester: studentProfile.semester,
      section: studentProfile.section,
      batch: studentProfile.batch,
      admissionYear: studentProfile.admissionYear,
      college: studentProfile.college,
      phone: studentProfile.phone || null,
      lastLoginAt: new Date()
    };

    res.json({
      success: true,
      message: 'Student login successful',
      data: { token, user: userObj }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const staffLogin = async (req: Request, res: Response) => {
  try {
    const { employeeId, password } = req.body;
    if (!employeeId || !password) {
      return res.status(400).json({ success: false, message: 'Employee ID and password are required.' });
    }

    const cleanEmpId = employeeId.trim();
    const staffProfile = await prisma.staffProfile.findFirst({
      where: {
        OR: [
          { employeeId: cleanEmpId },
          { employeeId: cleanEmpId.toLowerCase() },
          { employeeId: cleanEmpId.toUpperCase() }
        ]
      },
      include: { user: true }
    });

    if (!staffProfile || !staffProfile.user) {
      return res.status(401).json({ success: false, message: 'Invalid Employee ID or password.' });
    }

    if (staffProfile.user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, staffProfile.user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Employee ID or password.' });
    }

    await prisma.user.update({
      where: { id: staffProfile.user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = generateToken({
      userId: staffProfile.user.id,
      role: staffProfile.user.role,
      email: staffProfile.user.email
    });

    const userObj = {
      id: staffProfile.user.id,
      name: staffProfile.user.name,
      email: staffProfile.user.email,
      role: staffProfile.user.role,
      avatar: staffProfile.user.avatar,
      employeeId: staffProfile.employeeId,
      department: staffProfile.department,
      position: staffProfile.position,
      phone: staffProfile.phone || null
    };

    res.json({
      success: true,
      message: 'Staff login successful',
      data: { token, user: userObj }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: cleanEmail }
      },
      include: { adminProfile: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials.' });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.adminProfile?.department || 'Campus Admin',
      phone: user.adminProfile?.phone || null
    };

    res.json({
      success: true,
      message: 'Admin login successful',
      data: { token, user: userObj }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        staffProfile: true,
        adminProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    const { password, ...safeUser } = user;
    const userObj = {
      ...safeUser,
      registerNo: user.studentProfile?.registerNo,
      employeeId: user.staffProfile?.employeeId,
      department: user.studentProfile?.department || user.staffProfile?.department || user.adminProfile?.department,
      phone: user.studentProfile?.phone || user.staffProfile?.phone || user.adminProfile?.phone,
      personalEmail: user.studentProfile?.personalEmail,
      program: user.studentProfile?.program,
      year: user.studentProfile?.year,
      semester: user.studentProfile?.semester,
      section: user.studentProfile?.section,
      batch: user.studentProfile?.batch,
      admissionYear: user.studentProfile?.admissionYear,
      college: user.studentProfile?.college,
      academicStatus: user.studentProfile?.academicStatus,
      position: user.staffProfile?.position
    };

    res.json({ success: true, message: 'User profile retrieved', data: userObj });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { name, email, phone, avatar, department, college, registerNo, personalEmail } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, staffProfile: true, adminProfile: true }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(avatar && { avatar })
      }
    });

    if (user.role === 'STUDENT') {
      if (user.studentProfile) {
        await prisma.studentProfile.update({
          where: { id: user.studentProfile.id },
          data: {
            ...(phone !== undefined && { phone }),
            ...(personalEmail !== undefined && { personalEmail }),
            ...(department && { department }),
            ...(college && { college }),
            ...(registerNo && { registerNo })
          }
        });
      } else {
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            registerNo: registerNo || 'REG' + Date.now(),
            department: department || 'CSE',
            year: 1,
            phone: phone || ''
          }
        });
      }
    } else if (user.role === 'STAFF') {
      if (user.staffProfile) {
        await prisma.staffProfile.update({
          where: { id: user.staffProfile.id },
          data: {
            ...(phone !== undefined && { phone }),
            ...(department && { department }),
            ...(registerNo && { employeeId: registerNo })
          }
        });
      } else {
        await prisma.staffProfile.create({
          data: {
            userId: user.id,
            employeeId: registerNo || 'STF' + Date.now(),
            department: department || 'CSE',
            phone: phone || ''
          }
        });
      }
    } else if (user.role === 'ADMIN') {
      if (user.adminProfile) {
        await prisma.adminProfile.update({
          where: { id: user.adminProfile.id },
          data: {
            ...(phone !== undefined && { phone }),
            ...(department && { department })
          }
        });
      } else {
        await prisma.adminProfile.create({
          data: {
            userId: user.id,
            department: department || 'Central Research Facility',
            phone: phone || ''
          }
        });
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, staffProfile: true, adminProfile: true }
    });

    const userObj = {
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      role: updatedUser!.role,
      accountStatus: updatedUser!.accountStatus,
      avatar: updatedUser!.avatar,
      registerNo: updatedUser!.studentProfile?.registerNo,
      employeeId: updatedUser!.staffProfile?.employeeId,
      department: updatedUser!.studentProfile?.department || updatedUser!.staffProfile?.department || updatedUser!.adminProfile?.department,
      phone: updatedUser!.studentProfile?.phone || updatedUser!.staffProfile?.phone || updatedUser!.adminProfile?.phone,
      personalEmail: updatedUser!.studentProfile?.personalEmail,
      program: updatedUser!.studentProfile?.program,
      year: updatedUser!.studentProfile?.year,
      semester: updatedUser!.studentProfile?.semester,
      section: updatedUser!.studentProfile?.section,
      batch: updatedUser!.studentProfile?.batch,
      admissionYear: updatedUser!.studentProfile?.admissionYear,
      college: updatedUser!.studentProfile?.college,
      academicStatus: updatedUser!.studentProfile?.academicStatus,
      position: updatedUser!.staffProfile?.position
    };

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: userObj
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

