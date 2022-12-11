import { Router } from 'express';
import { BankAccountController } from '../controllers/bank-account.controller.js';

const router = Router();

router.get('/', BankAccountController.getAll);

router.post('/', BankAccountController.create);

router.patch('/:id', () => {});

export default router;
