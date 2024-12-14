/*
 * @Author: Peanut.ZhangHuan
 * @Description:  sync 会员数据同步
 * @Date: 2023-06-29 13:59:55
 * @Last Modified by: Peanut.ZhangHuan
 * @Last Modified time: 2023-07-10 18:00:00
 */
import mongoose from "mongoose";
const syncSchema = new mongoose.Schema(
  {
    chatInfo: Object,
    openId: {
      type: String,
      ref: "users",
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("syncs", syncSchema);
