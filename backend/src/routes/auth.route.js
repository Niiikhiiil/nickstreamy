import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  onboard,
  signupUser,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/onboarding", protectedRoute, onboard);
router.get("/me", protectedRoute, getMe);
export default router;
