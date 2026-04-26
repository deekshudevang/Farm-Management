import { Router } from 'express';
import { getCrops, createCrop, updateCrop } from '../controllers/crops';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCrops);
router.post('/', authenticateToken, createCrop);
router.put('/:id', authenticateToken, updateCrop);

export default router;
