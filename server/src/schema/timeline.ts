import mongoose from "mongoose";
const timelineSchema = new mongoose.Schema(
  {
    time: String,
    content: String,
  },
  { versionKey: false }
);

export default mongoose.model("timelines", timelineSchema);
