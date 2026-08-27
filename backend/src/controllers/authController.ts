import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authMiddleware';

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, registerNo, email, department, year, phone, password, role = 'STUDENT' } = req.body;

    if (!name || !registerNo || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, Register Number / Employee ID, Email, and Password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanId = registerNo.trim();

    const existingUser = await prisma.user.findFirst({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (role === 'STAFF') {
      const existingStaff = await prisma.staffProfile.findFirst({ where: { employeeId: cleanId } });
      if (existingStaff) {
        return res.status(400).json({ success: false, message: 'Staff with this Employee ID already exists.' });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: passwordHash,
          role: 'STAFF',
          avatar: null,
          staffProfile: {
            create: {
              employeeId: cleanId,
              department: department || 'Information Technology',
              phone: phone || null,
              position: typeof year === 'string' && year ? year : 'Faculty In-Charge'
            }
          }
        },
        include: {
          staffProfile: true
        }
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
        position: newUser.staffProfile?.position
      };

      return res.status(201).json({
        success: true,
        message: 'Faculty account registered successfully!',
        data: { token, user: userObj }
      });
    } else {
      const existingProfile = await prisma.studentProfile.findFirst({ where: { registerNo: cleanId } });
      if (existingProfile) {
        return res.status(400).json({ success: false, message: 'Student with this Register Number already exists.' });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: passwordHash,
          role: 'STUDENT',
          avatar: null,
          studentProfile: {
            create: {
              registerNo: cleanId,
              department: department || 'Information Technology',
              year: Number(year) || 1,
              phone: phone || null,
              college: 'Karpagam Institute of Technology'
            }
          }
        },
        include: {
          studentProfile: true
        }
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
        registerNo: newUser.studentProfile?.registerNo,
        department: newUser.studentProfile?.department,
        year: newUser.studentProfile?.year,
        college: newUser.studentProfile?.college
      };

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully!',
        data: { token, user: userObj }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { registerNo, password } = req.body;
    if (!registerNo || !password) {
      return res.status(400).json({ success: false, message: 'Register Number and password are required.' });
    }

    const cleanRegNo = registerNo.trim();
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
      return res.status(401).json({ success: false, message: 'Invalid Register Number or password.' });
    }

    const isMatch = await bcrypt.compare(password, studentProfile.user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Register Number or password.' });
    }

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
      avatar: studentProfile.user.avatar,
      registerNo: studentProfile.registerNo,
      department: studentProfile.department,
      year: studentProfile.year,
      college: studentProfile.college
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

    const isMatch = await bcrypt.compare(password, staffProfile.user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Employee ID or password.' });
    }

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
      position: staffProfile.position
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
        email: {
          equals: cleanEmail
        }
      },
      include: { adminProfile: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials.' });
    }

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
      department: user.adminProfile?.department || 'Campus Admin'
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

    const { password, ...safeUser } = user;
    const userObj = {
      ...safeUser,
      registerNo: user.studentProfile?.registerNo,
      employeeId: user.staffProfile?.employeeId,
      department: user.studentProfile?.department || user.staffProfile?.department || user.adminProfile?.department,
      phone: user.studentProfile?.phone || user.staffProfile?.phone || user.adminProfile?.phone,
      year: user.studentProfile?.year,
      college: user.studentProfile?.college,
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

    const { name, email, phone, avatar, department, college, registerNo } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, staffProfile: true, adminProfile: true }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Update base user properties
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(avatar && { avatar })
      }
    });

    // Update role-specific profile details including phone
    if (user.role === 'STUDENT' && user.studentProfile) {
      await prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: {
          ...(phone !== undefined && { phone }),
          ...(department && { department }),
          ...(college && { college }),
          ...(registerNo && { registerNo })
        }
      });
    } else if (user.role === 'STAFF' && user.staffProfile) {
      await prisma.staffProfile.update({
        where: { id: user.staffProfile.id },
        data: {
          ...(phone !== undefined && { phone }),
          ...(department && { department }),
          ...(registerNo && { employeeId: registerNo })
        }
      });
    } else if (user.role === 'ADMIN' && user.adminProfile) {
      await prisma.adminProfile.update({
        where: { id: user.adminProfile.id },
        data: {
          ...(phone !== undefined && { phone }),
          ...(department && { department })
        }
      });
    }

    // Fetch updated user object
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true, staffProfile: true, adminProfile: true }
    });

    const userObj = {
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      role: updatedUser!.role,
      avatar: updatedUser!.avatar,
      registerNo: updatedUser!.studentProfile?.registerNo,
      employeeId: updatedUser!.staffProfile?.employeeId,
      department: updatedUser!.studentProfile?.department || updatedUser!.staffProfile?.department || updatedUser!.adminProfile?.department,
      phone: updatedUser!.studentProfile?.phone || updatedUser!.staffProfile?.phone || updatedUser!.adminProfile?.phone,
      year: updatedUser!.studentProfile?.year,
      college: updatedUser!.studentProfile?.college,
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
