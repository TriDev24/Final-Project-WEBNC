import { Router } from "express";
import controller from "../controllers/identity.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/send-mail/:email", controller.sendMail);

router.post("/verify", controller.verifyAndChangePassword);

router.post("/login", controller.login);

router.post("/refresh-token", controller.generateRefreshToken);

router.get("/", auth("user"), controller.getAll);

router.post("/", auth("employee"), controller.create);

export default router;
