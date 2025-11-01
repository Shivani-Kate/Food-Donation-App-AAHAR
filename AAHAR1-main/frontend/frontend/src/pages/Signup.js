
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../css/signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("receiver");
  const [isNGO, setIsNGO] = useState(false); 
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    const contactPattern = /^\d{10}$/;
    if (!contactPattern.test(contact)) {
      setError("Contact must be 10 digits.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, contact, role, isNGO }),  
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setOtpSent(true);
      alert("OTP sent to your email. Enter it below to verify.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      alert("Email verified successfully! You can now login.");
      window.location.href = "/signin";
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <Navbar />
      <div className="signup-box">
        <h2>Sign Up</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!otpSent ? (
          <form onSubmit={handleSignup}>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="text" placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="receiver">Receiver</option>
              <option value="donor">Donor</option>
              {email === "aaharreal@gmail.com" && <option value="admin">Admin</option>}
            </select>

            
            {role === "receiver" && (
              <label style={{ display: "block", marginTop: "10px" }}>
                <input
                  type="checkbox"
                  checked={isNGO}
                  onChange={e => setIsNGO(e.target.checked)}
                />
                Sign up as NGO
              </label>
            )}

            <button type="submit">Sign Up</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
            <button type="submit">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
