import { Router } from 'express';
import { studentLogin, staffLogin, adminLogin, registerStudent, getMe, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerStudent);
router.post('/student/login', studentLogin);
router.post('/staff/login', staffLogin);
router.post('/admin/login', adminLogin);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

export default router;
