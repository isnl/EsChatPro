import { User, UserServiceCall } from "src/schema";
function userAdmin(router) {
  /**
   * 获取用户列表
   */
  router.get("/user", async function (req: any, res) {
    const { page = 1, size = 10, name, remark, openId } = req.query;
    let condition = {};
    // 昵称和备注的模糊查询
    if (name) {
      condition["name"] = {
        $regex: name,
        $options: "i",
      };
    }
    if (remark) {
      condition["remark"] = {
        $regex: remark,
        $options: "i",
      };
    }
    if(openId){
      condition["openId"] = {
        $regex: openId,
        $options: "i",
      };
    }
    try {
      let list = await User.aggregate([
        {
          $match: {
            ...condition,
          },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
        {
          $lookup: {
            from: "vips", // 关联的集合名
            localField: "openId",
            foreignField: "openId",
            as: "vipInfo",
          },
        },
      ]);
      list = list.map(item => {
        const [vipInfo] = item.vipInfo;
        if (vipInfo) {
          return {
            ...item,
            vipInfo,
          };
        } else {
          delete item.vipInfo;
          return item;
        }
      });
      const total = await User.countDocuments({ ...condition });
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
   * 用户分析
   */
  router.get("/user/:id", async function (req: any, res) {
    const { id } = req.params;
    const userInfo = await User.findOne({ openId: id });
    const usCalls = await UserServiceCall.find({ user_id: id }).sort({
      date: -1,
    });
    res.json({
      code: 200,
      userInfo,
      usCalls,
    });
  });
}
export default userAdmin;
