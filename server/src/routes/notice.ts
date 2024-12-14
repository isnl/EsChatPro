import express from "express";
import { Notice } from "../schema";
const router = express.Router();
/**
 * 公告列表
 */
router.get("/", async function (req: any, res) {
  const { page = 1, size = 10, latest } = req.query;
  if (latest) {
    // 获取最新的一条返回就可以了
    const notice = await Notice.findOne({}, { updatedAt: 0 }).sort({
      createdAt: -1,
    });
    return res.json({
      code: 200,
      data: notice,
    });
  }
  try {
    const list = await Notice.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(Number(size));
    const total = await Notice.countDocuments();
    res.json({
      code: 200,
      data: {
        list,
        total,
      },
    });
  } catch (error) {
    res.status(400).json({
      code: 10009,
      message: "获取公告列表失败" + error.message,
    });
  }
});
export default router;
