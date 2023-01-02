import { Router } from 'express';
import controller from '../controllers/change-password.controller.js'

const router = Router();

router.post('/change-password',controller.changePassword)

export default router