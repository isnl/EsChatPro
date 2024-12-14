import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    title: String,
    abstract: String,
    content: Object,
    openId: {
      type: String,
      ref: "users",
    },
    sort: {
      type: Number,
      default: 0,
    },
    tag: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export default mongoose.model("posts", postSchema);
