const mongoose = require("mongoose");

// 连接到 MongoDB
mongoose.connect(process.env.MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const administratorInfo = {
  openId: "GA02rPMrA", // 管理员openId - 任意输入
  id: "13b9964b-e50a-449d-b089-5389ace5e722",
  avatar: "E053",
  name: "EsChatPro",
  createdAt: new Date("2024-04-05 15:38:15"),
  role: 1, // 1: 管理员 2: 普通用户
};

// 获取数据库实例
const db = mongoose.connection;

// 监听连接事件
db.on("error", console.error.bind(console, "连接错误:"));
db.once("open", async function () {
  try {
    // 等待插入管理员信息
    await db.collection("users").insertOne(administratorInfo);
    // 等待插入路由信息
    await db.collection("dynamic_routes").insertOne({
      role: 1,
      routes: {
        name: "admin",
        path: "/admin",
        icon: "Menu",
        component: "/src/views/admin/index.vue",
        children: [
          {
            name: "dashboard",
            alias: "统计分析",
            path: "dashboard",
            icon: "Menu",
            component: "/src/views/admin/dashboard/index.vue",
          },
          {
            name: "user",
            alias: "用户管理",
            path: "user",
            icon: "MilkTea",
            component: "/src/views/admin/user/index.vue",
          },
          {
            name: "coupon",
            alias: "卡密管理",
            path: "coupon",
            icon: "Connection",
            component: "/src/views/admin/coupon/index.vue",
          },
          {
            name: "vip",
            alias: "会员管理",
            path: "vip",
            icon: "Lollipop",
            component: "/src/views/admin/vip/index.vue",
          },
          {
            name: "systemRole",
            alias: "系统角色",
            path: "systemRole",
            icon: "ReadingLamp",
            component: "/src/views/admin/systemRole/index.vue",
          },
          {
            name: "notice",
            alias: "网站公告",
            path: "notice",
            icon: "Message",
            component: "/src/views/admin/notice/index.vue",
          },
          {
            name: "share",
            alias: "分享管理",
            path: "share",
            icon: "Share",
            component: "/src/views/admin/share/index.vue",
          },
          {
            name: "timeline",
            alias: "更新记录",
            path: "timeline",
            icon: "Timer",
            component: "/src/views/admin/timeline/index.vue",
          },
          {
            name: "model",
            alias: "模型管理",
            path: "model",
            icon: "Monitor",
            component: "/src/views/admin/model/index.vue",
          },
        ],
      },
    });

    console.log("数据库初始化完成");
    // 确保数据写入后再关闭连接
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("初始化数据失败:", error);
    process.exit(1);
  }
});
