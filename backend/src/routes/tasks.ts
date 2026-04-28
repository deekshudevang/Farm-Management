import { Router } from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/tasks';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { TaskSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken, validate(TaskSchema), createTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

export default router;
