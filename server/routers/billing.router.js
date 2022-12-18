import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/billing.controller.js';

const router = Router();

router.use(auth);

router.post('/', controller.create);

export default router;
