import { Vip, User } from "src/schema";
function vipAdmin(router) {
  /**
   * 获取用户列表
   */
  router.get("/vip", async function (req: any, res) {
    let { page = 1, size = 10, name, remark, openId } = req.query;
    size = Number(size);
    let $match = {};
    // 昵称和备注的模糊查询
    if (name) {
      $match["userInfo.name"] = {
        $regex: name,
        $options: "i",
      };
    }
    if (remark) {
      $match["userInfo.remark"] = {
        $regex: remark,
        $options: "i",
      };
    }
    if (openId) {
      $match["userInfo.openId"] = {
        $regex: openId,
        $options: "i",
      };
    }

    try {
      const filterInfo: any = [
        {
          $facet: {
            data: [
              { $skip: (page - 1) * size },
              { $limit: size },
              {
                $lookup: {
                  from: "users",
                  localField: "openId",
                  foreignField: "openId",
                  as: "userInfo",
                },
              },
              { $match: { ...$match } },
            ],
            totalCount: [
              {
                $lookup: {
                  from: "users",
                  localField: "openId",
                  foreignField: "openId",
                  as: "userInfo",
                },
              },
              { $match: { ...$match } },
              { $count: "count" },
            ],
          },
        },
      ];
      let result = await Vip.aggregate([...filterInfo]);
      const list = result[0].data.map(item => ({
        ...item,
        userInfo: item.userInfo[0],
      }));
      const total = result[0].totalCount[0].count;
      res.json({
        code: 200,
        data: {
          list,
          total,
        },
      });
    } catch (error) {
      console.log(error);

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
   * GG机器人专用
   */
  router.get("/vip/:id", async function (req: any, res) {
    const { id } = req.params;
    const userList = await User.aggregate([
      {
        $match: { openId: id },
      },
      {
        $project: { remark: 0 },
      },
      {
        $lookup: {
          from: "vips",
          let: { userId: "$openId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$openId", "$$userId"] },
                    { $gt: ["$endTime", new Date()] },
                  ],
                },
              },
            },
            {
              $project: { _id: 0, startTime: 1, endTime: 1 }, // Include only necessary fields
            },
          ],
          as: "vipInfo",
        },
      },
    ]);
    if (userList.length) {
      const userInfo = userList[0];
      delete userInfo.openId;
      if (userInfo.vipInfo && userInfo.vipInfo.length) {
        userInfo.vipInfo = userInfo.vipInfo[0];
      } else {
        delete userInfo.vipInfo;
      }
      res.json({
        code: 200,
        data: userInfo,
      });
    } else {
      res.json({
        code: 200,
        data: false,
      });
    }
  });
}
export default vipAdmin;
