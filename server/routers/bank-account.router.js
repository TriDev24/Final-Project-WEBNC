import { Router } from 'express';
import { BankAccountController } from '../controllers/bank-account.controller.js';

const router = Router();

router.get('/', BankAccountController.getAll);

router.get('/payment-account', BankAccountController.getPaymentBankAccount);

router.get('/:id', BankAccountController.getById);

router.post('/', BankAccountController.create);

router.put('/:id', BankAccountController.update);

export default router;
