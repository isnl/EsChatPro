import express from "express";
import moment from "moment";
import { User, UserServiceCall, Model } from "../schema";
import { ChatGPTAPI } from "chatgpt";
import { SYSTEM_ROLES_STATUS } from "../constant";
import { isVip, onUserCheck } from "src/utils";
import { SystemRole } from "src/schema";
import Keyv from "keyv";
import { KeyvFile } from "keyv-file";
import path from "path";
const router = express.Router();
const ErrorCodeMessage: Record<string, string> = {
  401: "提供错误的API密钥 | Incorrect API key provided",
  403: "服务器拒绝访问，请稍后再试 | Server refused to access, please try again later",
  429: "1分钟内请求超过限制，限制 3 / min | Rate limit reached",
  502: "错误的网关 |  Bad Gateway",
  503: "服务器繁忙，请稍后再试 | Server is busy, please try again later",
  504: "网关超时 | Gateway Time-out",
  500: "服务器繁忙，请稍后再试 | Internal Server Error",
};

onUserCheck(router);
router.post("/", async function (req: any, res) {
  const { message, parentMessageId, systemMessage, modelId } = req.body;
  const modelInfo = await Model.findOneAndUpdate(
    { _id: modelId },
    { $inc: { usageCount: 1 } }
  );
  if (modelInfo) {
    const { openId } = req.auth;
    const userInfo = await User.findOne({ openId });

    let daily_limit: string | number = 0;
    let max_length: string | number = 0;
    const vip = await isVip(openId);
    if (vip) {
      // vip用户  调用次数限制++  文本输入上限++
      daily_limit = process.env.VIP_DAILY_LIMIT;
      max_length = process.env.VIP_MAX_LENGTH;
    } else {
      daily_limit = userInfo?.daily_limit || process.env.DAILY_LIMIT;
      max_length = userInfo?.max_length || process.env.MAX_LENGTH;
    }

    if (message.length > max_length) {
      res.status(400).json({
        code: 10001,
        message: `消息长度不能超过${max_length}字符`,
      });
      return;
    }

    // 调用次数上限判断
    const date = moment().format("YYYY-MM-DD");
    let uscInfo = await UserServiceCall.findOne({
      user_id: openId,
      date,
    });

    if (!uscInfo) {
      const usc = new UserServiceCall({
        user_id: openId,
        date,
        history: [],
        count: 0,
      });
      uscInfo = await usc.save();
    }

    if (uscInfo.count >= Number(daily_limit)) {
      res.status(400).json({
        code: 10002,
        message: "今日服务调用次数已达上限",
      });
      return;
    }

    uscInfo.count += 1;
    uscInfo.history.push(moment().format("HH:mm:ss"));
    await uscInfo.save();

    try {
      // 系统角色统计
      let options: any = {};
      if (systemMessage) {
        const systemRoleInfo = await SystemRole.findOneAndUpdate(
          { _id: systemMessage },
          { $inc: { usageCount: 1 } }
        );
        if (systemRoleInfo) {
          // 会员或者是公共系统角色的才可以使用
          if (isVip || systemRoleInfo.status === SYSTEM_ROLES_STATUS.PASS) {
            options = {
              systemMessage: systemRoleInfo.content,
              ...(systemRoleInfo.context && { parentMessageId }), // 是否开启上下文
            };
          }
        }
      } else {
        options = { parentMessageId };
      }
      // 上下文持久化
      const messageStore = new Keyv({
        store: new KeyvFile({
          filename: path.join(
            process.cwd(),
            `logs/keyv-file/${userInfo.name}-${openId}.json`
          ),
          expiredCheckDelay: 7 * 24 * 3600 * 1000, // ms, check and remove expired data in each ms
          writeDelay: 50, // ms, batch write to disk in a specific duration, enhance write performance.
          encode: JSON.stringify, // serialize function
          decode: JSON.parse, // deserialize function
        }),
      });
      const { apiKey, apiBaseUrl, model } = modelInfo;
      const api = new ChatGPTAPI({
        apiKey,
        apiBaseUrl,
        messageStore,
        systemMessage: "You are a helpful assistant.",
        completionParams: {
          model,
          presence_penalty: null,
          top_p: 0.99,
        },
      });
      res.setHeader("Content-type", "application/octet-stream");
      let firstChunk = true;
      const msgRes = await api.sendMessage(message, {
        ...options,
        onProgress: chat => {
          if (!chat.delta) return;
          res.write(
            firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`
          );
          firstChunk = false;
        },
      });
      res.end();
    } catch (error) {
      // 官方服务报错，回退次数
      uscInfo.count -= 1;
      await uscInfo.save();
      const code = error.statusCode;
      if (Reflect.has(ErrorCodeMessage, code)) {
        res.status(400).json({
          code,
          message: ErrorCodeMessage[code],
        });
      } else {
        res.status(400).json({
          code: 10003,
          message: "服务调用失败：" + error.message,
        });
      }
    }
  } else {
    res.status(400).json({
      code: 10021,
      message: "错误的请求，当前模型不存在",
    });
  }
});
export default router;
