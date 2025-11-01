
import React from 'react';
// import "../css/global.css";  
// import "../css/navbar.css";  
import "../css/home.css";    

import { FiInfo, FiLogIn, FiUserPlus, FiUser, FiShoppingCart, FiPlusCircle } from 'react-icons/fi';
import { GiMeal } from 'react-icons/gi';
import { FaLeaf } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header" >
        <GiMeal size={30} color="#fff" />
        <FaLeaf size={20} color="#76c043" />
        Aahaar
      </header>

      <nav className="home-nav">
        <Link to="/about"><FiInfo style={{ marginRight: '6px' }} />About</Link>
        <Link to="/signin"><FiLogIn style={{ marginRight: '6px' }} />Sign in</Link>
        <Link to="/signup"><FiUserPlus style={{ marginRight: '6px' }} />Sign Up</Link>
        <Link to="/donorpage"><FiPlusCircle style={{ marginRight: '6px' }} />Add Food</Link>
        <Link to="/receiver"><FiShoppingCart style={{ marginRight: '6px' }} />Receivers</Link>
        <Link to="/profile"><FiUser style={{ marginRight: '6px' }} />Profile</Link>
      </nav>

      <div className="home-message">
        "Your leftovers can be someone’s lifeline." <span className="emoji" role="img" aria-label="food emojis"></span>  
      </div>

      <img src='\img1.webp' alt='Delicious Food' width={1000} height={400} /> 

      <footer className="home-footer">
        © 2025 The Aahaar Foundation | Nourishing Lives, Reducing Waste
      </footer>
    </div>
  );
}

export default Home;
