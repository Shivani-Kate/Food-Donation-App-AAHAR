// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.mongodb+srv://shivanikate381_db_user:<db_password>@cluster0.ivgbxfd.mongodb.net/?appName=Cluster0); {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(" MongoDB Connected");
//   } catch (err) {
//     console.error("MongoDB Error:", err.message);
//     process.exit(1);
//   }
// };

// export default connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;