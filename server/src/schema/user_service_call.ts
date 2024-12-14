import mongoose from "mongoose";
const userServiceCallSchema = new mongoose.Schema(
  {
    user_id: String,
    date: String,
    count: Number,
    history: Array
  },
  { versionKey: false }
);
export default mongoose.model("user_service_calls", userServiceCallSchema);
