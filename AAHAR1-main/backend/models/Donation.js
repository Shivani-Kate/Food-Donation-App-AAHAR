
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String },
  donorContact: { type: String, required: true },
  menu: { type: [String], required: true },
  quantity: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  fresh: { type: String, required: true },
  description: { type: String },
  confirmed: { type: Boolean, default: false }, 
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverEmail: { type: String }
});


const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);

export default Donation;
