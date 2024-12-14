import { SystemRole } from "src/schema";
import { commonListQuery } from "src/utils";
export default router => {
  /**
   * @api {get} /admin/system_role 获取系统角色列表
   */
  router.get("/system_role", async function (req: any, res) {
    try {
      const data = await commonListQuery(req, SystemRole);
      res.json({
        code: 200,
        data,
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
   * @api {put} /admin/system_role/:id 系统角色审核
   */
  router.put("/system_role/:id", async function (req: any, res) {
    const { id: _id } = req.params;
    try {
      await SystemRole.updateOne(
        {
          _id,
        },
        {
          ...req.body,
        }
      );
      res.json({
        code: 200,
      });
    } catch (error) {
      res.status(400).json({
        code: 10020,
        message: "非法操作: " + error.message,
      });
    }
  });
};
