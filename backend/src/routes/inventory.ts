import { Router } from 'express';
import { 
  getInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../controllers/inventory';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { InventorySchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, getInventory);
router.post('/', authenticateToken, validate(InventorySchema), createInventoryItem);
router.put('/:id', authenticateToken, updateInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);

export default router;
