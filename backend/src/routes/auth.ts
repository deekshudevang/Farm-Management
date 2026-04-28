import { Router } from 'express';
import { register, login } from '../controllers/auth';
import { validate } from '../middleware/validate';
import { RegisterSchema, LoginSchema } from '../utils/schemas';

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);

export default router;
