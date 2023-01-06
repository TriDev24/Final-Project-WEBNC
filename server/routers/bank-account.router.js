import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/bank-account.controller.js';

const router = Router();

router.get('/all', auth(['employee']), controller.getAll);

router.get('/', auth(['customer']), controller.getAllByUserId);

router.get(
    '/by-account-number-and-bank-type',
    auth(['customer']),
    controller.getByAccountNumberAndBankType
);

router.get('/:id', auth(['customer']), controller.getById);

router.post('/', auth(['employee']), controller.create);

// API for other bank
router.put('/:id/payment', controller.rechargeMoney);

router.patch('/:id', auth(['employee', 'customer']), controller.update);

export default router;
