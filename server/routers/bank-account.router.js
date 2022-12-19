import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/bank-account.controller.js';

const router = Router();

router.use(auth);

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.post('/', controller.create);

router.patch('/:id', controller.update);

export default router;
