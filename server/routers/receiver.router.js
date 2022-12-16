import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/receiver.controller.js';

const router = Router();

router.use(auth);

router.get('/', controller.getAll);

router.post('/', controller.create);

export default router;
