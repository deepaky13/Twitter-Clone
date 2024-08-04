import { Router } from "express";
import { logout, signIn, signUp } from "../controllers/authController.js";

const router = Router();

// Route for creating a new user

router.post("/register", signIn);
router.post("/login", signIn);
router.post("/logout", logout );

export default router;
