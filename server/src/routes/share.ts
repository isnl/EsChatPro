import express from "express";
import { User, Share } from "../schema";
const router = express.Router();
router.get("/", async function (req, res) {
  const data = await Share.find().sort({ create_time: -1 });
  res.json({
    code: 200,
    data,
  });
});
router.get("/:id", async function (req, res) {
  const { id } = req.params;
  const { password } = req.query;
  try {
    const info = await Share.findById(id, {
      is_top: 0,
      reason: 0,
    });
    if (info.status === 2 || info.password === password) {
      const userInfo = await User.findOne(
        { openId: info.openId },
        { openId: 0, role: 0, _id: 0 }
      );
      // 删除info中的openId字段
      info.set("openId", undefined, { strict: false });
      res.json({
        code: 200,
        data: {
          ...info.toJSON(),
          userInfo,
        },
      });
    } else {
      res.json({
        code: 200,
        data: null,
      });
    }
  } catch (error) {
    res.status(400).json({
      code: 10005,
      message: "获取分享信息失败",
    });
  }
});
export default router;
