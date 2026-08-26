import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus } from '../controllers/bookingController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createBooking);
router.get('/my', authenticateToken, getMyBookings);
router.get('/', authenticateToken, requireRole(['ADMIN', 'STAFF']), getAllBookings);
router.put('/:id/status', authenticateToken, requireRole(['ADMIN', 'STAFF']), updateBookingStatus);

export default router;
