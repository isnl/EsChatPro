/*
 * @Author: Peanut.ZhangHuan
 * @Description:  系统角色 - systemMessage
 * @Date: 2023-06-29 11:03:22
 * @Last Modified by: Peanut.ZhangHuan
 * @Last Modified time: 2023-07-14 09:21:23
 */
import mongoose from "mongoose";
const systemRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      max: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      max: 500,
    },
    content: {
      type: String,
      required: true,
      max: 10000,
    },
    openId: {
      type: String,
      ref: "users",
    },
    status: {
      type: Number,
      default: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    context: {
      type: Boolean,
      default: false,
    },
    isSchema: {
      type: Boolean,
      default: false,
    },
    jsonSchema: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("system_roles", systemRoleSchema);
