import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/bank-type.controller.js';

const router = Router();

router.use(auth);

router.get('/', controller.getAll);

export default router;
