import express from "express";
import { onUserCheck } from "src/utils";
import { Sync } from "src/schema";
import { vipMiddleware } from "src/middleware/vip";
import { limitMiddleware } from "src/middleware/limit";
const router = express.Router();

onUserCheck(router);

router.get("/", vipMiddleware, async function (req: any, res) {
  const { openId } = req.auth;
  const result = await Sync.findOne({
    openId,
  });
  res.json({
    code: 200,
    data: result,
  });
});

router.post(
  "/",
  [vipMiddleware, limitMiddleware],
  async function (req: any, res) {
    const { chatInfo } = req.body;
    const { openId } = req.auth;
    try {
      // 更新或新建文档
      await Sync.findOneAndUpdate(
        { openId }, // 查找条件
        { chatInfo, version: Date.now() }, // 更新或新建的字段和值
        { upsert: true, new: true } // upsert 为 true 表示如果没有匹配的文档则创建新文档，new 为 true 表示返回更新后的文档
      );
      res.json({
        code: 200,
      });
    } catch (error) {
      res.status(400).json({
        code: 10015,
        message: "非法操作: " + error.message,
      });
    }
  }
);
export default router;
