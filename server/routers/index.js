import BankAccountRouter from './bank-account.router.js';
import { Router } from 'express';

const router = Router();

router.use('/bank-accounts', BankAccountRouter);

export default router;
