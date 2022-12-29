import { Router } from 'express';
import controller from '../controllers/identity.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth);

router.get('/', controller.getAll);

router.post('/login', controller.login);

router.post('/refresh-token', controller.generateRefreshToken);

router.post('/', controller.create);

export default router;
