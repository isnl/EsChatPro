import { SHARE_STATUS } from "src/constant";
import { Share } from "src/schema";
import { generatHtmlByShareInfo } from "../share/htmlGenerat";
export default router => {
  /**
   * 获取分享列表
   */
  router.get("/share", async function (req: any, res) {
    const { page = 1, size = 10, type, status } = req.query;
    const condition = {};
    if (type) {
      condition["type"] = type;
    }
    if (status) {
      condition["status"] = status;
    }

    try {
      const list = await Share.find(
        {
          ...condition,
        },
        { content: 0 }
      )
        .sort({ create_time: -1 })
        .skip((page - 1) * size)
        .limit(Number(size));
      const total = await Share.countDocuments({
        ...condition,
      });
      res.json({
        code: 200,
        data: {
          list,
          total,
        },
      });
    } catch (error) {
      res.json({
        code: 200,
        data: {
          list: [],
          total: 0,
        },
      });
    }
  });
  /**
   * 审核分享
   * 如果status为2，审核通过后，生成静态页面 shareTpl.js
   */
  router.put("/share/:id", async function (req: any, res) {
    const { status, reason } = req.body;
    const { id } = req.params;
    try {
      const info = await Share.findOneAndUpdate(
        {
          _id: id,
        },
        {
          status,
          reason,
        }
      );
      if (status == SHARE_STATUS.PASS) {
        generatHtmlByShareInfo(info);
      }
      res.json({ code: 200, data: id });
    } catch (error) {
      res.status(400).json({
        code: 10006,
        message: error.message,
      });
    }
  });
};
