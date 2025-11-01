
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ default import
import {
  addDonation,
  
 getAvailableDonations,
  confirmDonation,
 deleteDonationByDonor
} from "../controllers/donationController.js";
import { getDonationsForDonor, getReceivedDonations } from '../controllers/donationController.js';


const router = express.Router();
router.get("/available", authMiddleware, getAvailableDonations);
router.post("/", authMiddleware, addDonation);
router.get("/receivers", authMiddleware,getReceivedDonations );
router.post("/:id/confirm", authMiddleware, confirmDonation);
router.get("/donations", authMiddleware, getDonationsForDonor);
router.delete("/:id", authMiddleware, deleteDonationByDonor);

export default router;

