import { Router } from 'express';
import { 
  getFields, 
  createField, 
  updateField, 
  deleteField 
} from '../controllers/fields';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { FieldSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, getFields);
router.post('/', authenticateToken, validate(FieldSchema), createField);
router.put('/:id', authenticateToken, validate(FieldSchema), updateField);
router.delete('/:id', authenticateToken, deleteField);

export default router;
