import { Coupon, Vip, VipRecord } from "src/schema";
import { nanoid } from "nanoid";
import { COUPON_TYPE } from "src/constant";
import moment from "moment";
export default router => {
  /**
   * 卡密列表
   */
  router.get("/coupon", async function (req: any, res) {
    const { page = 1, size = 10, type, isUsed, remark } = req.query;
    const condition = {};
    if (type) {
      condition["type"] = type;
    }
    if (remark) {
      condition["remark"] = {
        $regex: remark,
      };
    }

    if (isUsed) {
      condition["openId"] = { $exists: isUsed };
    }
    try {
      const list = await Coupon.find({
        ...condition,
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * size)
        .limit(Number(size));
      const total = await Coupon.countDocuments({
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
   * 管理员使用卡密 - 生成会员
   * 1.会员记录表新增一条记录
   * 2.卡密表更新openId表明已被使用
   * 3.会员表更新会员到期时间
   */
  router.post("/useCoupon", async function (req: any, res) {
    const { openId, couponCode, couponType } = req.body;

    try {
      // 1.会员记录表新增一条记录
      const vipRecord = new VipRecord({
        openId,
        couponCode,
        couponType,
      });
      await vipRecord.save();
      // 2.卡密表更新openId表明已被使用
      await Coupon.updateOne(
        { code: couponCode },
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
        vipInfo.couponCode = couponCode;
        // 此处需判断会员是否已经是过期状态，如果是过期状态则从当前时间开始计算
        if (moment(vipInfo.endTime).isBefore(new Date())) {
          vipInfo.startTime = new Date();
          vipInfo.endTime = moment().add(couponType, "days").toDate();
        } else {
          // 未过期  直接累加
          vipInfo.endTime = moment(vipInfo.endTime)
            .add(couponType, "days")
            .toDate();
        }
        await vipInfo.save();
      } else {
        const vip = new Vip({
          startTime: new Date(),
          endTime: moment().add(couponType, "days").toDate(),
          openId,
          source: 2,
          couponCode,
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
  /**
   * 生成卡密
   * 默认10条月卡
   */
  router.post("/couponGenerate", async function (req: any, res) {
    const { count = 10, type = COUPON_TYPE.MONTH, remark } = req.body;
    let couponList = [];
    for (let i = 0; i < count; i++) {
      couponList.push({
        code: nanoid(),
        type,
        remark,
      });
    }
    try {
      await Coupon.insertMany(couponList);
      res.json({
        code: 200,
        data: {
          list: couponList.map(item => item.code),
        },
      });
    } catch (error) {
      res.status(400).json({
        code: 10008,
        message: error.message,
      });
    }
  });
};
