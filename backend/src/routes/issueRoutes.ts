import { Router } from 'express';
import { createIssue, getMyIssues, getAllIssues, getIssueById, updateIssueStatus, addIssueComment } from '../controllers/issueController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createIssue);
router.get('/my', authenticateToken, getMyIssues);
router.get('/', authenticateToken, getAllIssues);
router.get('/:id', authenticateToken, getIssueById);
router.put('/:id/status', authenticateToken, requireRole(['ADMIN', 'STAFF']), updateIssueStatus);
router.post('/:id/comments', authenticateToken, addIssueComment);

export default router;
