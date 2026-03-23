import { Router } from "express";
import authController from "../controllers/authController.js";
const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/users", authController.getUsers);

export default router;
