import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import controller from '../controllers/bank-account.controller.js';

const router = Router();

router.get('/', authMiddleware, controller.getAll);

router.get('/:id', authMiddleware, controller.getById);

router.post('/', authMiddleware, controller.create);

router.put('/:id', authMiddleware, controller.update);

export default router;
