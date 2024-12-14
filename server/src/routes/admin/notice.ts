import { Notice } from "src/schema";
export default router => {
  router.post("/notice", async function (req: any, res) {
    const { title, content } = req.body;
    // 用create方法新建一条数据
    await Notice.create({
      title,
      content,
    });
    res.json({
      code: 200,
    });
  });

  /**
   * 修改公告
   */
  router.put("/notice/:id", async function (req: any, res) {
    const { title, content } = req.body;
    const { id } = req.params;
    try {
      await Notice.findOneAndUpdate(
        {
          _id: id,
        },
        {
          title,
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
};
