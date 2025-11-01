
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("");
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [receivers, setReceivers] = useState([]);
 
  const [reports, setReports] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/signin");
    } else if (loggedInUser.role !== "admin") {
      navigate("/");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

 
  const fetchData = async (endpoint, setter, sectionName) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    
    if (
      data.message === "Token expired. Please log in again." ||
      data.message === "Invalid or malformed token." ||
      data.message === "No token provided"
    ) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/signin");
      return;
    }

    
    if (Array.isArray(data)) {
  setter(data);
} 

else if (data.totalDonations !== undefined) {
  setter(data);
} 
else {
  setter([]);
}


    setActiveSection(sectionName);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch data");
  }
};


  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.email}</p>

        <div className="admin-sections">
          <div className="admin-card">
            <h3>🍲 All Food Donations</h3>
            <p>View, edit, or remove donations.</p>
            <button onClick={() => fetchData("donations", setDonations, "donations")}>View Donations</button>
          </div>

          <div className="admin-card">
            <h3>🤝 Receiver Requests</h3>
            <p>Approve or manage receiver requests.</p>
            <button onClick={() => fetchData("receivers", setReceivers, "receivers")}>View Receivers</button>
          </div>

          <div className="admin-card">
            <h3>👥 Manage Users</h3>
            <p>See all registered users.</p>
            <button onClick={() => fetchData("users", setUsers, "users")}>View Users</button>
          </div>

          <div className="admin-card">
            <h3>📊 Reports</h3>
            <p>Check donation statistics and analytics.</p>
            <button onClick={() => fetchData("reports", setReports, "reports")}>View Reports</button>
          </div>
        </div>

        <div className="admin-data">
          {activeSection === "donations" && (
            <div>
              <h2>All Donations</h2>
              <ul>
                {donations.map(d => (
                 
  <li key={d._id}>
  {d.menu} - {d.quantity} units by {d.donorName} | Status: {d.confirmed ? "Accepted" : "Pending"}
</li>






                ))}
              </ul>
            </div>
          )}

          {activeSection === "users" && (
            <div>
              <h2>All Users</h2>
              <ul>
                {users.map(u => (
                  <li key={u._id}>{u.name} ({u.email}) - {u.role}</li>
                ))}
              </ul>
            </div>
          )}

          {activeSection === "receivers" && (
            <div>
              <h2>All Receivers</h2>
              <ul>
                {receivers.map(r => (
                  <li key={r._id}>{r.name} ({r.email})</li>
                ))}
              </ul>
            </div>
          )}

          {activeSection === "reports" && (
            <div>
              <h2>Reports</h2>
              <p>Total Donations: {reports.totalDonations}</p>
              <p>Total Users: {reports.totalUsers}</p>
              <p>Total Receivers: {reports.totalReceivers}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
