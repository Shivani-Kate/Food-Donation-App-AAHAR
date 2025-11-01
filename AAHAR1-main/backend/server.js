

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import adminRoutes from "./routes/adminRoutes.js";

// import donationRoutes from "./routes/donationRoutes.js";
// import authRoutes from "./routes/authRoutes.js"; 
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const PORT = 5000;


// app.use(cors());
// app.use(express.json());

// app.use("/api/admin", adminRoutes);
// app.use("/api/auth", authRoutes);        
// app.use("/api/donations", donationRoutes);

// app.get("/", (req, res) => {
//   res.json({ message: "Backend is working fine!" });
// });



// mongoose
//   .connect("mongodb://127.0.0.1:27017/aahaar", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));
 


// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 

import adminRoutes from "./routes/adminRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working fine!" });
});

// Connect MongoDB
connectDB();   // ✅ call your db.js connect function here

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
