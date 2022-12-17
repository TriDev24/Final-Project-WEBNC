import { Router } from 'express';
import controller from '../controllers/debtor.controller.js'
import auth from '../middlewares/auth.middleware.js'

const router = Router();

router.use(auth)

router.get('/',controller.getAllDebtor)
router.delete('/:id',controller.deleteDebtor)

export default router