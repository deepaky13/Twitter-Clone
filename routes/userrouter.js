import { Router } from "express";
import {
  followUnfollwings,
  getUserProfile,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile/:username", authenticateUser, getUserProfile);
router.post("/follow/:id", authenticateUser, followUnfollwings);
export default router;
