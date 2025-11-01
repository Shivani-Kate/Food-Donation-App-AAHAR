

import Donation from "../models/Donation.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";


export const addDonation = async (req, res) => {
  try {
    
    const { donorName, donorContact, menu, quantity, date, time, location, fresh, description } = req.body;


    if (!donorName || !donorContact || !menu?.length || !quantity || !date || !time || !location || !fresh) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const donation = new Donation({
      donorName,
      donorEmail: req.user.email,  
      donorContact,
      menu,
      quantity,
      date,
      time,
      location,
      fresh,
      description,
      confirmed: false
    });

    await donation.save();
   
const ngos = await User.find({ role: "receiver", isNGO: true }); 
for (let ngo of ngos) {
  await sendEmail(
    ngo.email,
    "New Food Donation Available 🍱",
    `Hello ${ngo.name || "NGO"},

A new food donation has been added by ${donation.donorName}.

Details:
• Menu: ${donation.menu.join(", ")}
• Quantity: ${donation.quantity}
• Description: ${donation.description || "N/A"}
• Date & Time: ${donation.date} at ${donation.time}
• Location: ${donation.location}
• Donor Contact: ${donation.donorContact}

Please contact the donor to coordinate pickup.

— Team Aahaar`
  );
}

    res.status(201).json({ message: "Donation added successfully", donation });
  } catch (err) {
    console.error("Add donation error:", err);
    res.status(500).json({ message: "Server error while adding donation" });
  }
};

export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find(); 
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};


export const getDonationsForDonor = async (req, res) => {
  try {
    const donorEmail = req.user.email;
    const donations = await Donation.find({ donorEmail });
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donor donations:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getReceivedDonations = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const donations = await Donation.find({ receiverEmail: userEmail, confirmed: true });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch received donations" });
  }
};

export const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ confirmed: false });

    const safeDonations = donations.map(d => ({
      ...d.toObject(),
      menu: Array.isArray(d.menu) ? d.menu : [],
    }));

    res.json(safeDonations);
  } catch (err) {
    console.error("Error fetching available donations:", err);
    res.status(500).json({ message: "Failed to fetch available donations" });
  }
};

export const deleteDonationByDonor = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    
   if (donation.donorEmail !== req.user.email) {
  return res.status(403).json({ message: "You are not authorized to delete this donation" });
}


    await Donation.findByIdAndDelete(id);
    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (err) {
    console.error("Delete donation error:", err);
    res.status(500).json({ message: "Failed to delete donation", error: err.message });
  }
};


export const confirmDonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { receiverEmail } = req.body;

   
    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

   
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    
    donation.confirmed = true;
    donation.receiverEmail = receiverEmail;
    await donation.save();

   
    if (!receiver.receivedDonations) receiver.receivedDonations = [];
    receiver.receivedDonations.push(donation._id);
    await receiver.save();

    
    const donor = await User.findOne({ email: donation.donorEmail });
    if (donor) {
      if (!donor.donatedDonations) donor.donatedDonations = [];
      donor.donatedDonations.push(donation._id);
      await donor.save();
    }

    
    await sendEmail(
      donation.donorEmail,
      "Your Donation Has Been Accepted 🎉",
      `Hello ${donation.donorName},

Good news! Your food donation has been accepted.

Receiver Email: ${receiverEmail}
Donation Details:
• Menu: ${donation.menu}
• Quantity: ${donation.quantity}
• Description: ${donation.description}
• Date: ${donation.date}
• Time: ${donation.time}
• Location: ${donation.location}

Thank you for helping reduce hunger 🙏
— Team Aahaar`
    );

  
    await sendEmail(
      receiverEmail,
      "Donation Details and Donor Information ✅",
      `Hello ${receiverEmail},

You have successfully received a food donation. Here are the details:

🍱 Food Information:
• Menu: ${donation.menu}
• Quantity: ${donation.quantity}
• Description: ${donation.description}
• Date: ${donation.date}
• Time: ${donation.time}
• Location: ${donation.location}

👤 Donor Information:
• Name: ${donation.donorName}
• Email: ${donation.donorEmail}
• Contact: ${donation.donorContact}

Please contact the donor to coordinate pickup.

— Team Aahaar`
    );

    res.json({ message: "Donation confirmed, profiles updated, and emails sent!" });
  } catch (error) {
    console.error("❌ Error confirming donation:", error);
    res.status(500).json({ message: "Server error while confirming donation" });
  }
};
