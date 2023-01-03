import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/receiver.controller.js';

const router = Router();

router.get('/', auth(['customer']), controller.getAll);

router.get('/:id', auth(['customer']), controller.getById);

router.post('/', auth(['customer']), controller.create);

router.put('/:id', auth(['customer']), controller.update);

router.delete('/:id', auth(['customer']), controller.delete);

export default router;
