import { Timeline } from "src/schema";
import { today } from "src/utils";
export default router => {
  router.post("/timeline", async function (req: any, res) {
    const { time, content } = req.body;
    const timeline = new Timeline({
      time: time ? time : today(),
      content,
    });
    await timeline.save();
    res.json({
      code: 200,
    });
  });
  /**
   * 修改更新记录
   */
  router.put("/timeline/:id", async function (req: any, res) {
    const { time, content } = req.body;
    const { id } = req.params;
    try {
      await Timeline.findOneAndUpdate(
        {
          _id: id,
        },
        {
          time,
          content,
        }
      );
      res.json({ code: 200 });
    } catch (error) {
      res.status(400).json({
        code: 10006,
        message: error.message,
      });
    }
  });
  /**
   * 删除更新记录
   */
  router.delete("/timeline/:id", async function (req: any, res) {
    const { id } = req.params;
    const deleteOk = await Timeline.findOneAndDelete({
      _id: id,
    });
    if (deleteOk) {
      res.json({
        code: 200,
      });
    }
  });
};
