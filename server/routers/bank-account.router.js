import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import controller from '../controllers/bank-account.controller.js';

const router = Router();

router.get('/all', auth(['employee']), controller.getAll);

router.get('/', auth(['customer']), controller.getAllByUserId); // done

router.get('/query-account', controller.queryAccount);

router.get(
    '/by-account-number-and-bank-type',
    auth(['customer']),
    controller.getByAccountNumberAndBankType
);

router.get('/:id', auth(['customer']), controller.getById);

router.post('/', auth(['employee']), controller.create); // done

// API for other bank
router.post('/payment-transaction', controller.rechargeMoney);

router.patch('/:id', auth(['employee', 'customer']), controller.update); // done

export default router;
