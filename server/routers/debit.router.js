import { Router } from 'express';
import controller from '../controllers/debit.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth(['customer']));

router.post('/', controller.createDebit);
router.get('/', controller.getAllDebit);
router.get('/notify/:accountNumber', controller.getDebitNotRead);
router.delete('/:id', controller.deleteDebit);

export default router;
