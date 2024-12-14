import mongoose from "mongoose";
const modelSchema = new mongoose.Schema(
  {
    name: String,
    model: String,
    apiKey: String,
    apiBaseUrl: String,
    description: String,
    usageCount: {
      type: Number,
      default: 0,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    sort: {
      type: Number,
      default: 0,
    },
    isBetter: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export default mongoose.model("models", modelSchema);
