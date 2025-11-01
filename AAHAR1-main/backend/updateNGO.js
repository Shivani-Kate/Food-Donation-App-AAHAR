import mongoose from "mongoose";
import User from "./models/User.js"; // make sure path is correct

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/aahaar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const makeUserNGO = async () => {
  try {
    const email = "shivanikate381@gmail.com"; // the user to make NGO

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      process.exit();
    }

    user.isNGO = true; // mark as NGO
    await user.save();
    console.log(`User ${email} is now marked as NGO`);
    process.exit();
  } catch (err) {
    console.error("Error updating user:", err);
    process.exit(1);
  }
};

makeUserNGO();
