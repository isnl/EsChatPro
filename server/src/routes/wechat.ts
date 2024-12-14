import express from "express";
const router = express.Router();
import jsSHA from "jssha";
import { parseString } from "xml2js";
import jwt from "jsonwebtoken";
import { User } from "../schema";
import myCache from "../store";
import { getRandomAvatar, getRandomName, randomCode } from "../utils";
import moment from "moment";
/**
 * 授权验证
 */
router.get("/", (req, res, next) => {
  const token = process.env.WECHAT_TOKEN;
  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  const { signature, timestamp, nonce, echostr } = req.query;

  //2.将token、timestamp、nonce三个参数进行字典序排序
  const array = [token, timestamp, nonce].sort();

  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  const tempStr = array.join("");
  const shaObj = new jsSHA("SHA-1", "TEXT");
  shaObj.update(tempStr);
  const scyptoString = shaObj.getHash("HEX");

  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (signature === scyptoString) {
    console.log("验证成功");
    res.send(echostr);
  } else {
    console.log("验证失败");
    res.send("验证失败");
  }
});
/**
 * 回复文字消息
 */
function textMsg(toUser, fromUser, content) {
  let resultXml = "<xml><ToUserName><![CDATA[" + fromUser + "]]></ToUserName>";
  resultXml += "<FromUserName><![CDATA[" + toUser + "]]></FromUserName>";
  resultXml += "<CreateTime>" + new Date().getTime() + "</CreateTime>";
  resultXml += "<MsgType><![CDATA[text]]></MsgType>";
  resultXml += "<Content><![CDATA[" + content + "]]></Content></xml>";
  return resultXml;
}
router.get("/verify", async function (req, res) {
  const { code = "", loginType } = req.query;
  const openId: string =
    loginType === "authCode" ? (code as string) : myCache.get(code as string);
  if (openId) {
    const openIdInfo = await User.findOne({ openId });
    const role = openIdInfo?.role;
    // 授权码登录方式
    if (loginType === "authCode" && !openIdInfo) {
      res.json({
        code: 400,
        msg: "登录失败，授权码错误！-_-",
      });
      return;
    }

    const tokenStr = jwt.sign({ openId, role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.json({
      code: 200,
      data: tokenStr,
    });
    if (!openIdInfo) {
      const user = new User({
        openId,
        daily_limit: process.env.DAILY_LIMIT,
        avatar: getRandomAvatar(),
        name: getRandomName(),
        create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await user.save();
    }
  } else {
    res.json({
      code: 400,
      msg: "您输入的验证码有误或已过期，请重新输入！-_-",
    });
  }
});
router.post("/", function (req, res) {
  var buffer = [];
  req.on("data", function (data) {
    buffer.push(data);
  });
  // 内容接收完毕
  req.on("end", function () {
    var msgXml = Buffer.concat(buffer).toString("utf-8");
    parseString(msgXml, { explicitArray: false }, function (err, result) {
      if (err) throw err;
      result = result.xml;
      const { ToUserName, FromUserName, MsgType, Content } = result;
      //回复普通消息
      if (MsgType === "text") {
        if (Content === "登录" || Content === "登陆" || Content === "验证码") {
          const code = randomCode();
          // 这里的FromUserName就是用户的openid
          myCache.set(code, FromUserName, 1 * 60 * 5);
          const sendXml = textMsg(
            ToUserName,
            FromUserName,
            `您的登录验证码是：${code}  ,  有效期为5分钟。\n\n------------------------\n`
          );
          res.send(sendXml);
        }
      }
    });
  });
});

export default router;
