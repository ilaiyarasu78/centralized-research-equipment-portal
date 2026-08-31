import { Router } from 'express';
import {
  getFacultyStudents,
  getFacultyStudentById,
  getFacultyStudentStats,
  removeFacultyStudent,
  updateFacultyStudent
} from '../controllers/facultyStudentController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/students', authenticateToken, requireRole(['STAFF', 'ADMIN']), getFacultyStudents);
router.get('/students/stats', authenticateToken, requireRole(['STAFF', 'ADMIN']), getFacultyStudentStats);
router.get('/students/:studentId', authenticateToken, requireRole(['STAFF', 'ADMIN']), getFacultyStudentById);
router.delete('/students/:studentId', authenticateToken, requireRole(['STAFF', 'ADMIN']), removeFacultyStudent);
router.put('/students/:studentId', authenticateToken, requireRole(['STAFF', 'ADMIN']), updateFacultyStudent);

export default router;
