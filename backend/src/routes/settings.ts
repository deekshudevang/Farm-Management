import { Router } from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/settings';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/password', authenticateToken, changePassword);
router.delete('/account', authenticateToken, deleteAccount);

export default router;
