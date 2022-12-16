import BankAccountRouter from './bank-account.router.js';
import BankTypeRouter from './bank-type.router.js';
import IdentityRouter from './identity.router.js';
import ReceiverRouter from './receiver.router.js';
import { Router } from 'express';

const router = Router();

router.use('/bank-accounts', BankAccountRouter);
router.use('/receivers', ReceiverRouter);
router.use('/bank-types', BankTypeRouter);
router.use('/identity', IdentityRouter);

export default router;
