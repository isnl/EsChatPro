import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {
  wechatRouter,
  shareRouter,
  chatRouter,
  userRouter,
  timelineRouter,
  homeRouter,
  adminRouter,
  noticeRouter,
  vipRouter,
  systemRoleRouter,
  syncRouter,
} from "./src/routes";
mongoose.connect(process.env.MongoURI);
const app = express();

// express允许跨域
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "clientDist")));

app.use("/wechat", wechatRouter);
app.use("/timeline", timelineRouter);
app.use("/share", shareRouter);
app.use("/notice", noticeRouter);
// 分享的静态模板渲染
app.use("/shareStatic", express.static(path.join(__dirname, "shareStatic")));

app.use("/", homeRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);
app.use("/sync", syncRouter);
app.use("/system_role", systemRoleRouter);

app.use("/vip", vipRouter);

app.use("/admin", adminRouter);
app.set("port", 3900); // 设定监听端口

//启动监听
app.listen(app.get("port"), function () {
  console.log("Express server listening http://localhost:3900");
});
