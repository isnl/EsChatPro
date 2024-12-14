/*
 * @Author: Peanut.ZhangHuan
 * @Description:  全局utils工具
 * @Date: 2023-04-05 21:41:19
 * @Last Modified by: Peanut.ZhangHuan
 * @Last Modified time: 2023-10-20 11:43:02
 */

import type { Request, Response, Router } from "express";
import moment from "moment";
import { AVATARS } from "src/constant";
import { expressjwt } from "express-jwt";
import { Vip } from "src/schema";
import type { Model } from "mongoose";

/**
 * 随机字符
 * @param len
 * @returns
 */
export function randomLetter(len: number) {
  const letters = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return str;
}

// 随机生成6位数验证码
export function randomCode() {
  return Math.random().toString().slice(-6);
}
/**
 * 获取随机头像id
 * @returns
 */
export function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
/**
 * 随机昵称
 * @returns
 */
export function getRandomName() {
  const name = Math.random().toString(36).slice(-5).toUpperCase();
  return `${name}-ChatGPTer`;
}
/**
 *
 * @returns 当天日期
 */
export function today() {
  return moment().format("YYYY-MM-DD");
}
/**
 * 头像校验
 * @param avatar
 * @returns
 */
export function validateAvatar(avatar) {
  return AVATARS.includes(avatar) ? avatar : "";
}

/**
 * 用户权限校验
 * @param router
 */
export function onUserCheck(router: Router) {
  router.use(
    expressjwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ["HS256"],
    })
  );
  router.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({
        code: 401,
        msg: "token无效或已过期",
      });
    } else {
      next(err);
    }
  });
}
/**
 * 管理员权限校验
 * @param router
 */
export function onAdministratorCheck(router: Router) {
  onUserCheck(router);
  router.use((req: any, res, next) => {
    if (req.auth && req.auth.role === 1) {
      next();
    } else {
      res.status(401).json({
        code: 401,
        msg: "权限不足",
      });
    }
  });
}
/**
 * 判断是否是vip
 * boolean: true 是vip   false 不是vip
 */
export async function isVip(openId) {
  const vipInfo = await Vip.findOne({
    openId,
  });
  if (vipInfo && vipInfo.endTime > new Date()) {
    return true;
  } else {
    return false;
  }
}
/**
 * 通用的列表查询
 */
export async function commonListQuery(
  req: Request,
  model: Model<any>,
  queryCondition: any = {},
  fields: any = {}
) {
  try {
    const { page = 1, size = 10 } = req.query as any;
    const validatedPage = Math.max(Number(page), 1);
    const validatedSize = Math.min(Math.max(Number(size), 1), 100); // Limiting size to a reasonable maximum
    const skipAmount = (validatedPage - 1) * validatedSize;
    const listQuery = model
      .find(queryCondition, fields)
      .skip(skipAmount)
      .limit(validatedSize)
      .sort({ createdAt: -1 });

    const countQuery = model.countDocuments({
      ...queryCondition,
    });
    const [list, total] = await Promise.all([listQuery, countQuery]);
    return {
      list,
      total,
    };
  } catch (error) {
    return {
      list: [],
      total: 0,
    };
  }
}

export async function commonDeleteAction(
  req: Request,
  res: Response,
  model: Model<any>
) {
  const _id = req.params.id;
  try {
    const result = await model.deleteOne({
      _id,
    });
    if (result.deletedCount) {
      res.json({
        code: 200,
      });
    } else {
      res.status(400).json({
        message: "非法操作",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "非法操作: " + error.message,
    });
  }
}
