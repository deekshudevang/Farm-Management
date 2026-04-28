import { Router } from 'express';
import { getCrops, createCrop, updateCrop } from '../controllers/crops';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { CropSchema, CropUpdateSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, getCrops);
router.post('/', authenticateToken, validate(CropSchema), createCrop);
router.put('/:id', authenticateToken, validate(CropUpdateSchema), updateCrop);

export default router;
