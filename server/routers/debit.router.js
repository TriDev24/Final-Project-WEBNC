import { Router } from 'express';
import controller from '../controllers/debit.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth(['customer']));

router.post('/', controller.createDebit);
router.get('/', controller.getAllDebit);
router.get('/notify/:accountNumber', controller.getAllNotify);
router.delete('/:id/:side', controller.deleteDebit);

export default router;
