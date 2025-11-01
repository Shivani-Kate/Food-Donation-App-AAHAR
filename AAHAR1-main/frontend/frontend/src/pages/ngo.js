import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReceivedDonations } from "../api";
import "../css/ngo.css";
function NGOPage() {
  const [received, setReceived] = useState([]);

  useEffect(() => {
    const fetchReceived = async () => {
      try {
        const donations = await getReceivedDonations(); 
        
        setReceived(donations);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReceived();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Received Food (NGO)</h2>
      {received.length === 0 ? (
        <p>No received food yet.</p>
      ) : (
        <ul>
          {received.map(d => (
            <li key={d._id}>
              <p><strong>Donor:</strong> {d.donorName}</p>
              <p><strong>Menu:</strong> {d.menu.join(", ")}</p>
              <p><strong>Quantity:</strong> {d.quantity}</p>
              <p><strong>Description:</strong> {d.description}</p>
              <p><strong>Date & Time:</strong> {d.date} at {d.time}</p>
              <p><strong>Location:</strong> {d.location}</p>
              <p><strong>Contact:</strong> {d.donorContact}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NGOPage;
