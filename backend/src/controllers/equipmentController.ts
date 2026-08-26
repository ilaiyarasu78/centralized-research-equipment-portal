import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getEquipment = async (req: Request, res: Response) => {
  try {
    const { category, labId, status, search } = req.query;

    const whereClause: any = {};

    if (category && category !== 'All' && category !== 'All Labs') {
      whereClause.category = String(category);
    }
    if (labId) {
      whereClause.labId = String(labId);
    }
    if (status && status !== 'All Status') {
      whereClause.status = String(status);
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { equipmentId: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    const equipmentList = await prisma.equipment.findMany({
      where: whereClause,
      include: {
        lab: { select: { id: true, name: true, location: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, message: 'Equipment fetched successfully', data: equipmentList });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        lab: true,
        bookings: {
          where: { status: { in: ['APPROVED', 'PENDING'] } },
          include: { user: { select: { name: true, avatar: true } } }
        }
      }
    });

    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found.' });
    }

    res.json({ success: true, message: 'Equipment detail fetched', data: equipment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const { name, equipmentId, category, labId, manufacturer, model, description, specifications, image } = req.body;

    const newEquip = await prisma.equipment.create({
      data: {
        name,
        equipmentId,
        category,
        labId,
        manufacturer,
        model,
        description,
        specifications,
        image,
        status: 'AVAILABLE'
      }
    });

    res.status(201).json({ success: true, message: 'Equipment created successfully', data: newEquip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.equipment.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, message: 'Equipment updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.equipment.delete({ where: { id } });
    res.json({ success: true, message: 'Equipment deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
