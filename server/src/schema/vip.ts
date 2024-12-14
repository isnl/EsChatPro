/*
 * @Author: Peanut.ZhangHuan
 * @Description:  Vip
 * @Date: 2023-06-29 17:45:36
 * @Last Modified by: Peanut.ZhangHuan
 * @Last Modified time: 2023-07-07 23:51:35
 */
import mongoose from "mongoose";
const vipSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    openId: {
      type: String,
      ref: "users",
    },
    source: {
      type: Number, // 1: 直接开通 2: 卡密开通
    },
    orderNo: {
      type: String, // 直接开通的第三方订单号
    },
    couponCode: {
      type: String,
      ref: "coupons",
    },
  },
  { versionKey: false, timestamps: true }
);
export default mongoose.model("vips", vipSchema);
