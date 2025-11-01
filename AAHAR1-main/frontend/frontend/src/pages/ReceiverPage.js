
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ReceiverPage() {
  const [donations, setDonations] = useState([]);
  const [email, setEmail] = useState("");
  const [menu, setMenu] = useState("");
  const [quantity, setQuantity] = useState("");
  const [matchedDonations, setMatchedDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donations/available", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
  }, []);

  const handleFilter = () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    const matches = donations.filter(donation => {
      const menuMatch = menu === "" || donation.menu.some(m => m.toLowerCase() === menu.toLowerCase());
      const quantityMatch = quantity === "" || donation.quantity.toLowerCase() === quantity.toLowerCase();
      return menuMatch && quantityMatch && !donation.confirmed;
    });

    if (matches.length === 0) alert("No matching donations found!");
    setMatchedDonations(matches);
  };

  const handleAccept = async (donation) => {
    if (!email) {
      alert("Enter email before accepting");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/donations/${donation._id}/confirm`,
        { receiverEmail: email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(res.data.message || "Donation confirmed!");
      setMatchedDonations(prev => prev.filter(d => d._id !== donation._id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to confirm donation");
    }
  };

  const handleReject = id => {
    setMatchedDonations(prev => prev.filter(d => d._id !== id));
  };

  return (
    <div className="profile-page">
      <Navbar />
      <h2>Find Matching Donations</h2>

      <div className="tabs">
        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
        <select value={menu} onChange={e => setMenu(e.target.value)}>
          <option value="">All Menu Types</option>
          <option value="VEG">VEG</option>
          <option value="NON-VEG">NON-VEG</option>
        </select>
        <select value={quantity} onChange={e => setQuantity(e.target.value)}>
          <option value="">All Quantities</option>
          <option value="10 persons">10 persons</option>
          <option value="10-100 persons">10-100 persons</option>
          <option value="100-500 persons">100-500 persons</option>
          <option value="more than 500">More than 500</option>
        </select>
        <button onClick={handleFilter}>Search</button>
      </div>

      <h3>Matching Donations:</h3>
      <ul>
        {matchedDonations.length === 0 ? (
          <li>No matching donations found.</li>
        ) : (
          matchedDonations.map(d => (
            <li key={d._id}>
              <div>
                <h4>{d.donorName}</h4>
                <p>Contact: {d.donorContact}</p>
                <p>Email: {d.donorEmail}</p>
                <p>Menu: {d.menu.join(", ")}</p>
                <p>Quantity: {d.quantity}</p>
                <p>Description: {d.description}</p>
                <p>Date: {d.date} | Time: {d.time}</p>
                <p>Location: {d.location}</p>
              </div>
              <div>
                <button onClick={() => handleAccept(d)}>Accept</button>
                <button onClick={() => handleReject(d._id)}>Reject</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ReceiverPage;
