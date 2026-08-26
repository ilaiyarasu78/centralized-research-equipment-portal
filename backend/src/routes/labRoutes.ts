import { Router } from 'express';
import { getLabs, getLabById, createLab, updateLab, deleteLab } from '../controllers/labController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getLabs);
router.get('/:id', getLabById);
router.post('/', authenticateToken, requireRole(['ADMIN']), createLab);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'STAFF']), updateLab);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteLab);

export default router;
