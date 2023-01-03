import { Router } from 'express';
import controller from '../controllers/identity.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/send-mail/:email', controller.sendMail);

router.post('/verify', controller.verifyAndChangePassword);

router.post('/login', controller.login);

router.post('/refresh-token', controller.generateAccessToken);

router.get('/', auth(['customer']), controller.getAll);

router.post('/', auth(['employee']), controller.create);

export default router;
