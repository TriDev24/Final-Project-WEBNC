import BankAccountRouter from './bank-account.router.js';
import IdentityRouter from './identity.router.js'
import { Router } from 'express';

const router = Router();

router.use('/bank-accounts', BankAccountRouter);
router.use('/identity', IdentityRouter);

export default router;
