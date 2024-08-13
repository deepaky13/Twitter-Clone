import { Router } from "express";
import {
  followUnfollwings,
  getSuggestedUser,
  getUserProfile,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile/:username", authenticateUser, getUserProfile);
router.post("/suggestedUser", authenticateUser, getSuggestedUser);
router.post("/follow/:id", authenticateUser, followUnfollwings);
export default router;
