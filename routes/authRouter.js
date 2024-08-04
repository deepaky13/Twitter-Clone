import { Router } from "express";
import {
  getCurrentUser,
  logout,
  signIn,
  signUp,
} from "../controllers/authController.js";
import { validateSignUp } from "../middleware/validationMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/currentuser", authenticateUser, getCurrentUser);
router.post("/register", validateSignUp, signUp);
router.post("/login", signIn);
router.post("/logout", logout);

export default router;
