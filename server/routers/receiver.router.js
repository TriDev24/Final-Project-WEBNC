import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/receiver.controller.js';

const router = Router();

router.get('/', auth(['customer']), controller.getAll);

router.post('/', auth(['customer']), controller.create);

export default router;
