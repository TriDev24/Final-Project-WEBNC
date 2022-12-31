import { Router } from 'express';
import controller from '../controllers/notify.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth(['customer']));

router.get('/:accountNumber', controller.getAllNotify);
router.delete('/:id', controller.deleteNotify)

export default router;
