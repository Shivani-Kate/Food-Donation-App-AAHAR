

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, required: true }, 
  isNGO: { type: Boolean, default: false }, 
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,

  
  receivedDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
  donatedDonations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
