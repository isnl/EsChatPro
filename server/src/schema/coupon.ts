/*
 * @Author: Peanut.ZhangHuan
 * @Description:  优惠券/卡密 - coupon
 * @Date: 2023-06-29 17:59:38
 * @Last Modified by: Peanut.ZhangHuan
 * @Last Modified time: 2023-07-07 23:49:17
 */
import mongoose from "mongoose";
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    startTime: {
      // 会员开始时间
      type: Date,
    },
    endTime: {
      // 过期时间
      type: Date,
    },
    type: {
      type: Number, // COUPON_TYPE 1天卡 3天卡 7天卡 30天卡 90天卡 180天卡 365天卡
    },
    remark: {
      type: String,
      default: "",
    },
    openId: {
      type: String,
      ref: "users",
    },
  },
  { versionKey: false, timestamps: true }
);
export default mongoose.model("coupons", couponSchema);
