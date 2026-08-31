import { Router } from 'express';
import {
  getAdminStudents,
  getAdminStudentById,
  updateStudentStatus,
  getAdminStudentStats,
  updateStudentDetails
} from '../controllers/adminStudentController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/students', authenticateToken, requireRole(['ADMIN']), getAdminStudents);
router.get('/students/stats', authenticateToken, requireRole(['ADMIN']), getAdminStudentStats);
router.get('/students/:studentId', authenticateToken, requireRole(['ADMIN']), getAdminStudentById);
router.patch('/students/:studentId/status', authenticateToken, requireRole(['ADMIN']), updateStudentStatus);
router.put('/students/:studentId/status', authenticateToken, requireRole(['ADMIN']), updateStudentStatus);
router.put('/students/:studentId', authenticateToken, requireRole(['ADMIN']), updateStudentDetails);

export default router;
