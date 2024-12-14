/*
 * @Author: Peanut.ZhangHuan 
 * @Description:  卡密激活或开通记录
 * @Date: 2023-06-29 23:28:46 
 * @Last Modified by: Peanut.ZhangHuan
 * @Last Modified time: 2023-06-29 23:38:53
 */
import mongoose from "mongoose";
const vipRecordSchema = new mongoose.Schema(
  {
    couponType: {
      type: Number, // COUPON_TYPE 1天卡  3天卡 7天卡 30天卡 90天卡 180天卡 365天卡
    },
    openId: {
      type: String,
      ref: "users",
    },
    couponCode: {
      type: String,
      ref: "coupons",
    },
  },
  { versionKey: false, timestamps: true }
);
export default mongoose.model("vip_records", vipRecordSchema);
