
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllDonations, getAllUsers, getAllReceivers, getReports } from "../controllers/adminController.js";


const router = express.Router();


router.use(authMiddleware);


router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
});

router.get("/donations", getAllDonations);
router.get("/users", getAllUsers);


router.get("/receivers", getAllReceivers);
router.get("/reports", getReports);

export default router;
