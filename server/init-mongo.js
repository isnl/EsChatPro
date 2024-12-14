db = connect("mongodb://localhost:27017/eschat");
db.users.insertOne({
  openId: "GA02rPMrA",
  id: "poRElv1koxGkvYriOlM61",
  avatar: "E053",
  name: "GFN1E-ChatGPTer",
  createdAt: new Date("2024-04-05 15:38:15"),
  role: 1,
});
db.dynamic_routes.insertOne({
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
