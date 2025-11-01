
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  signup,
  signin,
  verifyOtp,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify-otp", verifyOtp);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
