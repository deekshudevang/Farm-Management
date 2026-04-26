import { Router } from 'express';
import { 
  getInventory, 
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../controllers/inventory';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getInventory);
router.post('/', authenticateToken, createInventoryItem);
router.put('/:id', authenticateToken, updateInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);

export default router;
