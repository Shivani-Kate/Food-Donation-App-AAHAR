
import React from "react";
import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";


import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile"; 
import Ngo from "./pages/ngo";
import DonorPage from "./pages/DonorPage";
import ReceiverPage from "./pages/ReceiverPage";
import AdminDashboard from "./pages/AdminDashboard";
const user = JSON.parse(localStorage.getItem("user"));




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/donorpage" element={<DonorPage />} />
        <Route path="/receiver" element={<ReceiverPage />} />
       <Route path="/ngo" element={<Ngo/>} />

       <Route
  path="/admin"
  element={
    user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/signin" />
  }
/>

      </Routes>
    </Router>
  );
}

export default App;

