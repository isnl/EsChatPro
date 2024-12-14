import { isVip } from "src/utils";
const vipMiddleware = async (req, res, next) => {
  const { openId } = req.auth;
  const vip = await isVip(openId);
  if (!vip) {
    return res.status(400).json({
      code: 10014,
      message: "您还不是VIP",
    });
  }
  next();
};

export { vipMiddleware };
