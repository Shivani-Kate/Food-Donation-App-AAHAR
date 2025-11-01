
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  receiverName: String,
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
  },
  status: { type: String, default: "Pending" },
});

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);
export default Request;
