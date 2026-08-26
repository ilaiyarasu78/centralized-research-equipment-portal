import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getLabs = async (req: Request, res: Response) => {
  try {
    const labs = await prisma.lab.findMany({
      include: {
        equipments: true,
        _count: {
          select: { equipments: true, bookings: true, issues: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const enrichedLabs = labs.map((lab) => {
      const availableCount = lab.equipments.filter((e) => e.status === 'AVAILABLE').length;
      return {
        ...lab,
        totalEquipments: lab.equipments.length,
        availableEquipments: availableCount
      };
    });

    res.json({ success: true, message: 'Labs fetched successfully', data: enrichedLabs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLabById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lab = await prisma.lab.findUnique({
      where: { id },
      include: {
        equipments: true,
        issues: {
          include: { user: { select: { name: true, avatar: true } } }
        }
      }
    });

    if (!lab) {
      return res.status(404).json({ success: false, message: 'Lab not found.' });
    }

    const availableCount = lab.equipments.filter((e) => e.status === 'AVAILABLE').length;

    res.json({
      success: true,
      message: 'Lab details fetched',
      data: { ...lab, totalEquipments: lab.equipments.length, availableEquipments: availableCount }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLab = async (req: Request, res: Response) => {
  try {
    const { name, code, category, description, location, capacity, openingHours, image } = req.body;
    const newLab = await prisma.lab.create({
      data: { name, code, category, description, location, capacity: Number(capacity) || 30, openingHours, image }
    });
    res.status(201).json({ success: true, message: 'Lab created successfully', data: newLab });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLab = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.lab.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, message: 'Lab updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLab = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lab.delete({ where: { id } });
    res.json({ success: true, message: 'Lab deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
