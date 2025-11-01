
import User from "../models/User.js";
import Donation from "../models/Donation.js";


export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllReceivers = async (req, res) => {
  try {
    const receivers = await User.find({ role: "receiver" });
    res.status(200).json(receivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getReports = async (req, res) => {
  try {
    
    const confirmedDonations = await Donation.find({ confirmed: true });

   
    const totalDonations = await Donation.countDocuments();
    const totalUsers = await User.countDocuments(); 
    const totalReceivers = await User.countDocuments({ role: "receiver" });

    res.status(200).json({
      confirmedDonations,
      totalDonations,
      totalUsers,
      totalReceivers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


