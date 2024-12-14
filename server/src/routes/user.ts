import express from "express";
import {
  User,
  UserServiceCall,
  Share,
  Vip,
  VipRecord,
  Coupon,
  Model,
} from "../schema";
import {
  isVip,
  onUserCheck,
  randomLetter,
  today,
  validateAvatar,
} from "src/utils";
import moment from "moment";
const router = express.Router();

onUserCheck(router);

router.get("/", async function (req: any, res) {
  const { openId, role } = req.auth;
  // 根据openId查询用户信息
  // 用户信息
  const userListService = User.aggregate([
    {
      $match: { openId },
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

  // 调用信息
  const uscInfoService = UserServiceCall.findOne({
    user_id: openId,
    date: today(),
  });

  // 模型列表
  const modelListService = Model.find(
    {
      enable: true,
    },
    {
      enable: 0,
      apiKey: 0,
      apiBaseUrl: 0,
    }
  ).sort({
    createdAt: -1,
    sort: -1,
  });

  const [userList, uscInfo, modelList] = await Promise.all([
    userListService,
    uscInfoService,
    modelListService,
  ]);

  const userInfo = userList[0];
  console.log("userInfo", userInfo);

  if (userInfo.vipInfo && userInfo.vipInfo.length) {
    userInfo.vipInfo = userInfo.vipInfo[0];
  } else {
    delete userInfo.vipInfo;
  }
  let vipConstants = {
    daily_limit: userInfo?.daily_limit || process.env.DAILY_LIMIT,
    max_length: userInfo?.max_length || process.env.MAX_LENGTH,
  };
  if (userInfo.vipInfo) {
    vipConstants = {
      daily_limit: process.env.VIP_DAILY_LIMIT,
      max_length: process.env.VIP_MAX_LENGTH,
    };
  }

  // 如果是管理员
  if (role && role === 1) {
    vipConstants = {
      daily_limit: 99999,
      max_length: 999999,
    };
  }

  res.json({
    code: 200,
    data: {
      ...userInfo,
      current: uscInfo?.count || 0,
      ...vipConstants,
      modelList,
    },
  });
});
router.put("/", async function (req: any, res) {
  const { openId } = req.auth;
  let { name, avatar } = req.body;
  if (avatar) {
    avatar = validateAvatar(avatar);
  }
  if (name) {
    name = name.trim().substring(0, 15);
    const user = await User.findOne({ name });
    if (user && user.openId !== openId) {
      return res.status(400).json({
        code: 10013,
        message: "当前昵称已存在",
      });
    }
  }
  try {
    const params = { name, avatar };
    await User.updateOne({ openId }, params);
    res.json({
      code: 200,
    });
  } catch (error) {
    res.status(400).json({
      code: 10003,
      message: "用户信息更新失败" + error.message,
    });
  }
});
/**
 * 查看分享列表
 */
router.get("/share", async function (req: any, res) {
  const { openId } = req.auth;
  const { page = 1, size = 10 } = req.query;
  try {
    const list = await Share.find({ openId }, { openId: 0, is_top: 0 })
      .sort({ create_time: -1 })
      .skip((page - 1) * size)
      .limit(Number(size));
    const total = await Share.countDocuments({ openId });
    res.json({
      code: 200,
      data: {
        list,
        total,
      },
    });
  } catch (error) {
    res.status(400).json({
      code: 10005,
      message: "获取分享列表失败" + error.message,
    });
  }
});
/**
 * 新增分享
 */
router.post("/share", async function (req: any, res) {
  const { openId } = req.auth;
  const { title = "", content = [], tag = "", type = "" } = req.body;
  const count = await Share.countDocuments({
    openId,
  });
  const vip = await isVip(openId);
  const shareMaxLength = vip ? 999 : Number(process.env.SHARE_MAX_COUNT);
  if (count >= shareMaxLength) {
    res.status(400).json({
      code: 10006,
      message: "当前分享数量已达上限，请升级VIP或者联系站长。",
    });
    return;
  }
  const password = randomLetter(4);
  const share = await new Share({
    create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    title,
    content,
    openId,
    tag,
    type,
    reason: "",
    password,
    is_top: false,
    status: 0,
  });
  await share.save();
  res.json({
    code: 200,
    password,
    id: share._id,
  });
});
/**
 * 用户手动删除分享
 */
router.delete("/share/:id", async function (req: any, res) {
  const { openId } = req.auth;
  const { id } = req.params;
  const deleteOk = await Share.findOneAndDelete({
    _id: id,
    openId,
  });
  if (deleteOk) {
    res.json({
      code: 200,
    });
  } else {
    res.status(400).json({
      code: 10007,
      message: "非法操作",
    });
  }
});
/**
 * 公开分享
 */
router.put("/share/:id", async function (req: any, res) {
  const { openId } = req.auth;
  const { id } = req.params;
  const updateOk = await Share.findOneAndUpdate(
    {
      _id: id,
      openId,
    },
    {
      status: 1,
    }
  );
  if (updateOk) {
    res.json({
      code: 200,
    });
  } else {
    res.status(400).json({
      code: 10007,
      message: "非法操作",
    });
  }
});

/**
 * 用户消费卡密 - 生成会员
 * 1.会员记录表新增一条记录
 * 2.卡密表更新openId表明已被使用
 * 3.会员表更新会员到期时间
 */
router.post("/useCoupon", async function (req: any, res) {
  const { openId } = req.auth;
  const { code } = req.body;
  // 1.判断卡密是否存在
  const couponInfo = await Coupon.findOne({
    code,
  });
  if (!couponInfo) {
    res.status(400).json({
      code: 10011,
      message: "卡密不存在",
    });
    return;
  }
  // 2.判断卡密是否已经被使用
  if (couponInfo.openId) {
    res.status(400).json({
      code: 10012,
      message: "卡密已被使用",
    });
    return;
  }

  try {
    // 1.会员记录表新增一条记录
    const vipRecord = new VipRecord({
      openId,
      couponCode: code,
      couponType: couponInfo.type,
    });
    await vipRecord.save();
    // 2.卡密表更新openId表明已被使用
    await Coupon.updateOne(
      { code },
      {
        openId,
      }
    );
    // 3.判断是否有开通过VIP，如果有则更新会员到期时间，如果没有则新增一条会员记录
    const vipInfo = await Vip.findOne({
      openId,
    });
    if (vipInfo) {
      vipInfo.source = 2;
      vipInfo.couponCode = code;
      // 此处需判断会员是否已经是过期状态，如果是过期状态则从当前时间开始计算
      if (moment(vipInfo.endTime).isBefore(new Date())) {
        vipInfo.startTime = new Date();
        vipInfo.endTime = moment().add(couponInfo.type, "days").toDate();
      } else {
        // 未过期  直接累加
        vipInfo.endTime = moment(vipInfo.endTime)
          .add(couponInfo.type, "days")
          .toDate();
      }
      await vipInfo.save();
    } else {
      const vip = new Vip({
        startTime: new Date(),
        endTime: moment().add(couponInfo.type, "days").toDate(),
        openId,
        source: 2,
        couponCode: code,
      });
      await vip.save();
    }
    res.json({
      code: 200,
    });
  } catch (error) {
    res.status(400).json({
      code: 10010,
      message: "卡密激活失败" + error.message,
    });
  }
});
export default router;
