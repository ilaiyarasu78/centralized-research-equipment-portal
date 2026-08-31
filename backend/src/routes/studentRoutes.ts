import { Router } from 'express';
import { getStudentMe } from '../controllers/studentController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticateToken, requireRole(['STUDENT']), getStudentMe);

export default router;
