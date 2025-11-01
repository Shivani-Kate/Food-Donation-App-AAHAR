
import React from "react";
import Navbar from "../components/Navbar";

// import "../css/global.css";
// import "../css/navbar.css";
import "../css/about.css";

function About() {
  return (
    <div>
      <Navbar />

      <div className="about-container">
        <h1 className="about-box">
          About Aahaar: Fighting Hunger Through Food Donation & Redistribution
        </h1>

        <img src="/IMG2.jpg" alt="Food Donation" />

        <p>
          Aahaar is a food donation and redistribution initiative platform
          committed to reducing food waste and fighting hunger. Every day, tons
          of perfectly edible food goes to waste while millions go to bed
          hungry. Aahaar bridges this gap by collecting surplus food from
          restaurants, events, and households, and redistributing it to those in
          need.
       

        
          Our mission is to create a sustainable and hunger-free world, one meal
          at a time. With the help of our dedicated volunteers and partners, we
          ensure that good food reaches the people who need it the most — safely
          and efficiently.
        

       
          Join us in our journey to feed the hungry and reduce food waste.
          Together, we can make a difference.
        </p>

        <footer id="footer">
          Diverting Excess Food To Hungry People
        </footer>
      </div>
    </div>
  );
}

export default About;
