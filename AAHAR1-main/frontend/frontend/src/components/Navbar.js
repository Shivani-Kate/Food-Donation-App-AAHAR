
import React from "react";
import { Link } from "react-router-dom";
import { FiHome,FiInfo, FiLogIn, FiUserPlus, FiPlusCircle, FiShoppingCart,FiUser } from 'react-icons/fi';
import "../css/navbar.css"; 
const user = JSON.parse(localStorage.getItem("user"));

function Navbar() {
  return (
    <nav className="navbar">
       <Link to="/home"><FiHome /> Home</Link>
      <Link to="/about"><FiInfo /> About</Link>
      <Link to="/signin"><FiLogIn /> SignIn</Link>
      <Link to="/signup"><FiUserPlus /> SignUp</Link>
      <Link to="/donorpage"><FiPlusCircle /> Add Food</Link>
      <Link to="/receiver"><FiShoppingCart/> Receiver</Link>
      <Link to="/profile"><FiUser /> Profile</Link>
      {/* <Link to="/ngo"><FiUser /> Ngo</Link> */}
     {user && user.role === "admin" && (
  <Link to="/admin"><FiUser /> Admin</Link>
)}


    </nav>
  );
}

export default Navbar;
