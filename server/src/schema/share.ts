import mongoose from "mongoose";
const shareSchema = new mongoose.Schema(
  {
    create_time: String,
    title: String,
    content: Object,
    openId: {
      type: String,
      ref: "users",
    },
    tag: String,
    type: String,
    is_top: Boolean,
    password: String,
    status: Number, // 0: 待审核-私有 1: 提交审核 2: 审核通过 3: 审核不通过
    reason: String,
  },
  {
    versionKey: false,
  }
);
export default mongoose.model("shares", shareSchema);
