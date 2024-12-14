import mongoose from "mongoose";
const noticeSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default mongoose.model("notices", noticeSchema);
