
import Request from "../models/Request.js";
import Donation from "../models/Donation.js";
import { sendEmail } from "../utils/email.js"; 


export const addRequest = async (req, res) => {
  try {
    const { receiverName, receiverEmail, foodId } = req.body; 

    const newRequest = new Request({ receiverName, foodId });
    await newRequest.save();


    const donation = await Donation.findById(foodId);
    const subject = "Donation Request Confirmation";
    const text = `Hi ${receiverName},\n\nYour request for the donation "${donation.menu.join(", ")}" from ${donation.donorName} has been received.\nPickup at: ${donation.location}\nQuantity: ${donation.quantity}\n\nThank you for using Aahaar!`;
    
    await sendEmail(receiverEmail, subject, text);

    res.json({ message: "Request added and email sent", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Error adding request", error: err.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("foodId");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};
