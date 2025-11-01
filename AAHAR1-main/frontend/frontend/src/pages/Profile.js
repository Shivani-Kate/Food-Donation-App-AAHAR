
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/global.css";
import "../css/navbar.css";
import "../css/profile.css";
import { FaUserCircle } from "react-icons/fa";
import { getProfile, updateProfile, deleteDonation } from "../api";

function Profile() {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });
  const [donated, setDonated] = useState([]);
  const [received, setReceived] = useState([]);
  const [activeTab, setActiveTab] = useState("donated");

  useEffect(() => {
  const loadProfileAndActivities = async () => {
    try {
      const data = await getProfile();
      setUser(data);
      setForm({ name: data.name, password: "" });

      if (data.role === "donor") {
        setDonated(data.donatedDonations); 
      } else if (data.role === "receiver") {
        setReceived(data.receivedDonations); 
      }
    } catch (err) {
      console.error("Error loading profile or donations:", err);
    }
  };
  loadProfileAndActivities();
}, []);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      setForm({ name: updated.name, password: "" });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    try {
      await deleteDonation(id);
      setDonated(donated.filter(d => d._id !== id));
      alert("Donation deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete donation");
    }
  };

  return (
    <div className="profile-page" style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <Navbar />
      <div className="profile-avatar" style={{ textAlign: "center", marginBottom: "20px" }}>
        <FaUserCircle size={80} color="#4caf50" />
        <h2>{user.name || "User"}</h2>
      </div>

      <h2>Profile</h2>
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {editing ? (
        <div>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password" />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)}>Edit Profile</button>
      )}

      {/* Tabs */}
      <div className="tabs" style={{ marginTop: "20px" }}>
        <button
          onClick={() => setActiveTab("donated")}
          style={{ marginRight: "10px", backgroundColor: activeTab === "donated" ? "#4caf50" : "#ccc", color: activeTab === "donated" ? "white" : "black" }}
        >
          Donated Food
        </button>
        <button
          onClick={() => setActiveTab("received")}
          style={{ backgroundColor: activeTab === "received" ? "#4caf50" : "#ccc", color: activeTab === "received" ? "white" : "black" }}
        >
          Received Food
        </button>
      </div>

      <div style={{ marginTop: "10px", textAlign: "left" }}>
        {activeTab === "donated" ? (
          donated.length === 0 ? (
            <p>No donations yet.</p>
          ) : (
            <ul>
              {donated.map(d => (
                <li key={d._id}>
                  {(Array.isArray(d.menu) ? d.menu.join(", ") : "No menu")} - {d.date} at {d.time} - {d.location}
                  <button style={{ marginLeft: "10px" }} onClick={() => handleDeleteDonation(d._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )
        ) : (
          received.length === 0 ? (
            <p>No received food yet.</p>
          ) : (
            <ul>
              {received.map(d => (
                <li key={d._id}>
                  {(Array.isArray(d.menu) ? d.menu.join(", ") : "No menu")} from {d.donorName} - {d.date} at {d.time} - {d.location}
                </li>
              ))}
            </ul>
          )
        )}
      </div>

      <button className="logout" onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
    </div>
  );
}

export default Profile;
