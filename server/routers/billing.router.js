import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/billing.controller.js';

const router = Router();

router.use(auth);

router.get('/history', controller.getHistory);

router.post('/', controller.create);

router.post('/:id/verify-otp', controller.verifyOtp);

export default router;
