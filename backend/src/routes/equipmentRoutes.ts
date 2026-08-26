import { Router } from 'express';
import { getEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getEquipment);
router.get('/:id', getEquipmentById);
router.post('/', authenticateToken, requireRole(['ADMIN']), createEquipment);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'STAFF']), updateEquipment);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteEquipment);

export default router;
