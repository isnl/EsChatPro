import express from "express";
import { User, UserServiceCall, Share, DynamicRoute } from "../schema";
import { today, onAdministratorCheck } from "src/utils";
import {
  userAdmin,
  vipAdmin,
  shareAdmin,
  timelineAdmin,
  couponAdmin,
  noticeAdmin,
  systemRoleAdmin,
  modelAdmin,
} from "./admin/index";
const router = express.Router();
onAdministratorCheck(router);

userAdmin(router);
vipAdmin(router);
shareAdmin(router);
timelineAdmin(router);
couponAdmin(router);
noticeAdmin(router);
systemRoleAdmin(router);
modelAdmin(router);

router.get("/dynamic_routes", async function (req: any, res) {
  const info = await DynamicRoute.findOne({ role: 1 });
  res.json({
    code: 200,
    data: info ? info.routes : [],
  });
});

/**
 * 指标统计
 */
router.get("/statistics", async function (req: any, res) {
  const todayDate = today();
  const userCount = await User.countDocuments();
  const shareCount = await Share.countDocuments();
  const callCount = await UserServiceCall.countDocuments();

  const todayRegisterUserCount = await User.countDocuments({
    create_time: {
      $regex: "^" + todayDate,
    },
  });

  const todayUsedUserCount = await UserServiceCall.countDocuments({
    date: todayDate,
  });

  const todayCallsResult = await UserServiceCall.aggregate([
    {
      $match: {
        date: todayDate, // 匹配日期字段为今天的数据
      },
    },
    {
      $group: {
        _id: null,
        countSum: {
          $sum: "$count", // 计算count字段的总和
        },
      },
    },
    {
      $project: {
        _id: 0,
        count: "$countSum",
      },
    },
  ]);

  const todayShareCount = await Share.countDocuments({
    create_time: {
      $regex: "^" + todayDate,
    },
  });
  res.json({
    code: 200,
    data: {
      userCount,
      shareCount,
      callCount,
      todayRegisterUserCount,
      todayUsedUserCount,
      todayCallsCount: todayCallsResult[0] ? todayCallsResult[0].count : 0,
      todayShareCount,
    },
  });
});
/**
 * 按日期调用统计
 */
router.get("/statistics/calls", async function (req: any, res) {
  const list = await UserServiceCall.aggregate([
    {
      $group: {
        _id: "$date",
        countSum: {
          $sum: "$count",
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: "$countSum",
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);
  res.json({
    code: 200,
    data: list,
  });
});
/**
 * 用户在date值为startTime和endTime区间的调用排行分页统计
 * eg: startTime: 2023-05-17  endTime: 2023-05-25
 */
router.get("/statistics/calls/user", async function (req: any, res) {
  const { page = 1, size = 10, startTime, endTime } = req.query;
  let condition = {};
  if (startTime && endTime) {
    condition["date"] = {
      $gte: startTime,
      $lte: endTime,
    };
  }

  const [listResult, countResult] = await Promise.all([
    UserServiceCall.aggregate([
      {
        $match: {
          ...condition,
        },
      },
      {
        $group: {
          _id: "$user_id",
          countSum: {
            $sum: "$count",
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          count: "$countSum",
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $skip: (page - 1) * size,
      },
      {
        $limit: Number(size),
      },
      {
        $lookup: {
          from: "vips", // 关联的集合名
          localField: "user_id",
          foreignField: "openId",
          as: "vipInfo",
        },
      },
    ]),
    UserServiceCall.aggregate([
      {
        $match: {
          ...condition,
        },
      },
      {
        $group: {
          _id: "$user_id",
        },
      },
      {
        $group: {
          _id: null,
          totalCount: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  const total = countResult.length > 0 ? countResult[0].totalCount : 0;

  let list = listResult.map(item => {
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

  res.json({
    code: 200,
    data: {
      list,
      total,
    },
  });
});

export default router;
