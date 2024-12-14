import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    avatar: String,
    name: String,
    openId: {
      type: String,
      unique: true,
    },
    role: Number,
    daily_limit: Number,
    create_time: String,
    max_length: {
      type: Number,
      required: false,
    },
  },
  { versionKey: false }
);

export default  mongoose.model("users", userSchema);
