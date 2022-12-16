import { Router } from 'express';
import controller from '../controllers/identity.controller.js';
import auth from '../middlewares/auth.middleware.js'

const router = Router();

router.post('/login', controller.login);

router.post('/', controller.create)

router.post('/refresh_token', controller.generateRefreshToken);

export default router;
