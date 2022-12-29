import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/bank-account.controller.js';

const router = Router();

router.use(auth);

router.get('/all', controller.getAll);

router.get('/', controller.getAllByUserId);

router.get('/:id', controller.getById);

router.post('/', controller.create);

router.patch('/:id', controller.update);

router.put('/:id/recharge', controller.rechargeMoney);

export default router;
