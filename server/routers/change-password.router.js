import { Router } from 'express';
import controller from '../controllers/change-password.controller.js'

const router = Router();

router.post('/',controller.changePassword)

export default router