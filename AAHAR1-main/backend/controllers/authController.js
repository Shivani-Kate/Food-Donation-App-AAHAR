
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();


const sendOtpEmail = async (user, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your OTP for Aahaar Signup",
    html: `<p>Hello ${user.name},</p>
           <p>Your OTP is: <b>${otp}</b></p>
           <p>It will expire in 10 minutes.</p>`,
  });
};


export const signup = async (req, res) => {
  try {
    const { name, email, password, role, contact } = req.body;

    if (!name || !email || !password || !role || !contact)
      return res.status(400).json({ message: "All fields are required" });

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const contactPattern = /^\d{10}$/;
    if (!contactPattern.test(contact))
      return res.status(400).json({ message: "Contact must be 10 digits" });

    if (role === "admin" && email !== "aaharreal@gmail.com")
      return res.status(403).json({ message: "Only aaharreal@gmail.com can be admin" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      contact,
      isVerified: false,
    });

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendOtpEmail(user, otp);

    res.status(201).json({
      message: "Signup successful! OTP sent to your email.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now login." });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};


export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Verify your email before signing in" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        isVerified: user.isVerified
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Signin failed", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("donatedDonations")
      .populate("receivedDonations");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, password } = req.body;
    if (name) user.name = name;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json(user); 
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};
