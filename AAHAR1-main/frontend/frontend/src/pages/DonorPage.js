
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { addDonation } from "../api.js";
import "../css/global.css";
import "../css/navbar.css";
import "../css/donor.css";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function RecenterMap({ latlng }) {
  const map = useMap();
  useEffect(() => {
    map.setView(latlng, map.getZoom());
  }, [latlng, map]);
  return null;
}

function DonorPage() {
  const [formData, setFormData] = useState({
    donorName: "",
    donorContact: "", 
    menu: [],
    quantity: "",
    description: "",
    date: "",
    time: "",
    location: "",
    fresh: "",
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [mapPosition, setMapPosition] = useState([18.5204, 73.8567]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let updatedMenu = [...formData.menu];
      if (checked) updatedMenu.push(value);
      else updatedMenu = updatedMenu.filter((item) => item !== value);
      setFormData({ ...formData, menu: updatedMenu });
    } else if (type === "radio") {
      setFormData({ ...formData, fresh: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.donorName) return alert("Donor Name is required.");
    if (!formData.donorContact) return alert("Contact number is required."); 
    if (formData.menu.length === 0) return alert("Select at least one menu.");
    if (!formData.quantity) return alert("Quantity is required.");
    if (!formData.date) return alert("Date is required.");
    if (!formData.time) return alert("Time is required.");
    if (!formData.location) return alert("Location is required.");
    if (!formData.fresh) return alert("Select if food is fresh.");
    if (formData.fresh === "disagree") {
      alert("You must agree that food is fresh before submitting.");
      return;
    }

    try {
      const res = await addDonation(formData);
      alert(res.message || "Donation added successfully!");
      setFormData({
        donorName: "",
        donorContact: "", 
        menu: [],
        quantity: "",
        description: "",
        date: "",
        time: "",
        location: "",
        fresh: "",
      });
    } catch (err) {
      console.error("Add donation error:", err.message);
      alert(err.message || "Failed to add donation");
    }
  };

  const handleSearch = async () => {
    if (!locationSearch) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const coords = [parseFloat(lat), parseFloat(lon)];
      setMapPosition(coords);
      setFormData({ ...formData, location: display_name });
    } else {
      alert("Location not found");
    }
  };

  const MapClick = () => {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];
        setMapPosition(coords);
        setFormData({ ...formData, location: `${e.latlng.lat}, ${e.latlng.lng}` });
      },
    });
    return null;
  };

  return (
    <div className="donor-page">
      <Navbar />
      <h1>Donor Information</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Donor Details</legend>

          <label>
            Donor Name:
            <input
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contact Number:
            <input
              type="text"
              name="donorContact" 
              value={formData.donorContact}
              onChange={handleChange}
              required
            />
          </label>

          <div>
            <label>Menu:</label>
            <label>
              <input
                type="checkbox"
                name="menu"
                value="VEG"
                checked={formData.menu.includes("VEG")}
                onChange={handleChange}
              />
              VEG
            </label>
            <label>
              <input
                type="checkbox"
                name="menu"
                value="NON-VEG"
                checked={formData.menu.includes("NON-VEG")}
                onChange={handleChange}
              />
              NON-VEG
            </label>
          </div>

          <label>
            Quantity:
            <select name="quantity" value={formData.quantity} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="10 persons">10 persons</option>
              <option value="10-100 persons">10-100 persons</option>
              <option value="100-500 persons">100-500 persons</option>
              <option value="more than 500">More than 500</option>
            </select>
          </label>

          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <label>
            Time:
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </label>

          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              style={{ width: "60%", marginRight: "10px" }}
            />
            <button type="button" onClick={handleSearch}>Search</button>
          </div>

          <div style={{ height: "300px", marginTop: "10px" }}>
            <MapContainer center={mapPosition} zoom={13} style={{ height: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={mapPosition}>
                <Popup>{formData.location || "Selected location"}</Popup>
              </Marker>
              <MapClick />
              <RecenterMap latlng={mapPosition} />
            </MapContainer>
          </div>

          <div>
            <label>All above food is fresh:</label>
            <label>
              <input
                type="radio"
                name="fresh"
                value="agree"
                checked={formData.fresh === "agree"}
                onChange={handleChange}
                required
              />
              Agree
            </label>
            <label>
              <input
                type="radio"
                name="fresh"
                value="disagree"
                checked={formData.fresh === "disagree"}
                onChange={handleChange}
              />
              Disagree
            </label>
          </div>

          <button type="submit">Submit</button>
        </fieldset>
      </form>
    </div>
  );
}

export default DonorPage;
