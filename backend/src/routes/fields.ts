import { Router } from 'express';
import { 
  getFields, 
  createField, 
  updateField, 
  deleteField 
} from '../controllers/fields';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getFields);
router.post('/', authenticateToken, createField);
router.put('/:id', authenticateToken, updateField);
router.delete('/:id', authenticateToken, deleteField);

export default router;
