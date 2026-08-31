import { Router } from 'express';
import {
  getCampusLocations,
  getAnnouncements,
  createAnnouncement,
  getLostFoundItems,
  createLostFoundItem,
  submitFeedback,
  getAdminStats,
  getAllUsers,
  deleteUser
} from '../controllers/extraController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/map-locations', getCampusLocations);

router.get('/announcements', getAnnouncements);
router.post('/announcements', authenticateToken, requireRole(['ADMIN']), createAnnouncement);

router.get('/lost-found', getLostFoundItems);
router.post('/lost-found', authenticateToken, createLostFoundItem);

router.post('/feedback', authenticateToken, submitFeedback);

router.get('/admin/stats', authenticateToken, requireRole(['ADMIN', 'STAFF']), getAdminStats);
router.get('/admin/users', authenticateToken, requireRole(['ADMIN']), getAllUsers);
router.delete('/admin/users/:userId', authenticateToken, requireRole(['ADMIN']), deleteUser);

export default router;
