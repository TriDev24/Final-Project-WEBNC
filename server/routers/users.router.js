import { Router } from 'express';
import controller from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
// import auth from '../middlewares/auth.middleware.js'

const router = Router();

// router.use(auth)

router.get('/', controller.getAllUser);
router.get('/:id', controller.getUserDetail);
router.patch(
    '/:id',
    authMiddleware(['employee', 'admin']),
    controller.updateUser
);
// router.post('/:id/change-password',controller.changePassword)

export default router;
