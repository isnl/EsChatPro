<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 32 32"><g fill="none"><path fill="#F8312F" d="M5 3.5a1.5 1.5 0 0 1-1 1.415V12l2.16 5.487L4 23c-1.1 0-2-.9-2-1.998v-7.004a2 2 0 0 1 1-1.728V4.915A1.5 1.5 0 1 1 5 3.5Zm25.05.05c0 .681-.44 1.26-1.05 1.468V12.2c.597.347 1 .994 1 1.73v7.01c0 1.1-.9 2-2 2l-2.94-5.68L28 11.93V5.018a1.55 1.55 0 1 1 2.05-1.468Z"></path><path fill="#FFB02E" d="M11 4.5A1.5 1.5 0 0 1 12.5 3h7a1.5 1.5 0 0 1 .43 2.938c-.277.082-.57.104-.847.186l-3.053.904l-3.12-.908c-.272-.08-.56-.1-.832-.18A1.5 1.5 0 0 1 11 4.5Z"></path><path fill="#CDC4D6" d="M22.05 30H9.95C6.66 30 4 27.34 4 24.05V12.03C4 8.7 6.7 6 10.03 6h11.95C25.3 6 28 8.7 28 12.03v12.03c0 3.28-2.66 5.94-5.95 5.94Z"></path><path fill="#212121" d="M9.247 18.5h13.506c2.33 0 4.247-1.919 4.247-4.25A4.257 4.257 0 0 0 22.753 10H9.247A4.257 4.257 0 0 0 5 14.25a4.257 4.257 0 0 0 4.247 4.25Zm4.225 7.5h5.056C19.34 26 20 25.326 20 24.5s-.66-1.5-1.472-1.5h-5.056C12.66 23 12 23.674 12 24.5s.66 1.5 1.472 1.5Z"></path><path fill="#00A6ED" d="M10.25 12C9.56 12 9 12.56 9 13.25v2.5a1.25 1.25 0 1 0 2.5 0v-2.5c0-.69-.56-1.25-1.25-1.25Zm11.5 0c-.69 0-1.25.56-1.25 1.25v2.5a1.25 1.25 0 1 0 2.5 0v-2.5c0-.69-.56-1.25-1.25-1.25Z"></path></g></svg>

# `EsChatPro` <!-- omit in toc -->

![GitHub top language](https://img.shields.io/github/languages/top/isnl/EsChatPro)
![GitHub last commit](https://img.shields.io/github/last-commit/isnl/EsChatPro)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

<p class="align center">
<h4>一个开箱即用且极易上手的类ChatGPT/通义千问/文心一言的商业开源应用<br>可接入任何 <code>OpenAI接口兼容的大语言模型</code></h4>
</p>
</div>

## 系列文章 <!-- omit in toc -->

- [本地开发运行指南](./docs/本地开发运行指南.md)
- [接入大模型教程](./docs/接入大模型教程.md)

## 版本特性 <!-- omit in toc -->

- [x] 可接入任何主流 `OpendAI接口兼容` 的 AI 大语言模型
- [x] 支持暗黑主题 🌙
- [x] 完美的移动端兼容 📱
- [x] 打字机回复效果 ⌨️
- [x] 上下文对话支持，可创建多轮对话记录
- [x] 自定义系统角色
- [x] 整段生成内容支持复制、代码复制、代码高亮
- [x] 双登录模式：
  - 1.关联公众号登录(个人订阅号即可)
  - 2.普通的授权码登录模式(手动分发授权码)
- [x] 自定义调用次数及文本输入上限
- [x] MongoDB 数据库
- [x] 后台仪表盘：使用分析、用户概览、调用日历
- [x] 用户管理
- [x] 商业化-VIP 会员管理
- [x] 商业化-VIP 用户卡密管理：生成、激活
- [x] 生成内容分享管理，类似于百度网盘的链接分享，分享后其他用户可通过分享密码查看对话内容
- [x] 分享内容 `静态模板渲染`，利于 SEO
- [x] 自定义系统角色、后台管理
- [x] 内容分享管理、公告管理 、更新记录管理
- [x] 接入模型管理

> [!NOTE] > **具体关于使用微信公众号实现网站授权登录的技术方案可参考如下文章，非常详细
> [https://juejin.cn/post/7234394174274158650](https://juejin.cn/post/7234394174274158650)**

---

## 目录 <!-- omit in toc -->

- [前置要求](#前置要求)
  - [Node](#node)
  - [MongoDB](#mongodb)
  - [用户配置 服务端 server 目录](#用户配置-服务端-server-目录)
    - [MongoURI](#mongouri)
    - [JWT\_SECRET\_KEY](#jwt_secret_key)
    - [MAX\_LENGTH](#max_length)
    - [DAILY\_LIMIT](#daily_limit)
    - [VIP\_MAX\_LENGTH](#vip_max_length)
    - [VIP\_DAILY\_LIMIT](#vip_daily_limit)
    - [SHARE\_MAX\_COUNT](#share_max_count)
    - [WECHAT\_TOKEN](#wechat_token)
  - [用户配置 客户端 client 目录](#用户配置-客户端-client-目录)
    - [网站登录 - 公众号二维码存放路径](#网站登录---公众号二维码存放路径)
- [应用内部分截图展示](#应用内部分截图展示)
  - [🏠 首页](#-首页)
    - [信息修改](#信息修改)
    - [数据同步](#数据同步)
    - [系统角色](#系统角色)
    - [内容分享](#内容分享)
  - [后台管理](#后台管理)
  - [移动端兼容](#移动端兼容)
- [技术栈](#技术栈)
  - [客户端](#客户端)
  - [服务端](#服务端)
- [目录结构](#目录结构)
  - [客户端](#客户端-1)
  - [服务端](#服务端-1)
- [安装部署](#安装部署)
  - [本地开发](#本地开发)
- [本地构建](#本地构建)
  - [Docker](#docker)
- [注意事项](#注意事项)
  - [公众号用户设置管理员](#公众号用户设置管理员)
  - [非公众号授权登录方式 新建用户](#非公众号授权登录方式-新建用户)
  - [添加管理员用户](#添加管理员用户)
  - [添加 AI 大模型](#添加-ai-大模型)
- [常见问题](#常见问题)
- [免责声明](#免责声明)
- [支持作者](#支持作者)
  - [Alipay](#alipay)
  - [Wepay](#wepay)
- [LICENSE](#license)

---

## 前置要求

### Node

`node` 需要 `^18 || ^19 || ^20` 版本（`14 <= node <= 18`的需要安装 [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)）

可以通过如下命令查看自己本机的 `node` 版本

```bash
node -v
# v18.19.0
```

使用 [nvm](https://github.com/nvm-sh/nvm) 可管理本地多个 `node` 版本

`Mac` 用户可以使用 `n` 来管理 node 版本

```bash
brew install n
```

### MongoDB

`EsChatPro` 使用的是 `MongoDB` 数据库，关于 `MongoDB` 的安装，网络上有很多教程，这里就不赘述了。

### 用户配置 服务端 server 目录

配置文件请参考 `server/.env.example` 文件

在服务端 `server` 根目录中创建 `.env` 文件，并复制 `.env.example` 文件内容进行修改

详细配置信息如下：

#### MongoURI

- **必须**: `true`
- **描述**: 连接 MongoDB 数据库的 URI 地址

#### JWT_SECRET_KEY

- **必须**: `true`
- **描述**: 设置用于用户登录 jwt 鉴权的 secret key。

#### MAX_LENGTH

- **必须**: `false`
- **默认值**: `2000`
- **描述**: 普通用户允许的最大输入字符长度。默认限制为 2000 字符。

#### DAILY_LIMIT

- **必须**: `false`
- **默认值**: `20`
- **描述**: 普通用户每日调用接口的额度上限。默认设定为每日最多调用 `20` 次。

#### VIP_MAX_LENGTH

- **必须**: `false`
- **默认值**: `10000`
- **描述**: VIP 用户允许的最大输入字符长度。默认限制为 10000 字符。

#### VIP_DAILY_LIMIT

- **必须**: `false`
- **默认值**: `99`
- **描述**: VIP 用户每日调用接口的额度上限。默认设定为每日最多调用 `99` 次。

#### SHARE_MAX_COUNT

- **必须**: `false`
- **默认值**: `5`
- **描述**: 普通用户分享内容数量上限。默认限制为 5 条。

#### WECHAT_TOKEN

- **必须**: `true`
- **描述**: 对应微信公众号后台设置的 token，可按需自定义。

### 用户配置 客户端 client 目录

#### 网站登录 - 公众号二维码存放路径

`client/static/imgs/mp_qrcode.jpg`

请注意，如果是 `Docker` 部署，则路径如下

`server/clientDist/static/imgs/mp_qrcode.jpg`

## 应用内部分截图展示

<details>
<summary>
截图请展开查看
</summary>

### 🏠 首页

![用户登录](https://static.iiter.cn/article/106ee6fce8ccf2969bc8841e7c3e3463.png)

![首页目录展开](https://static.iiter.cn/article/52bf81b4999c58d7bfbbfbddf9beb0ba.png)

![首页目录收起](https://static.iiter.cn/article/0bc35bd4d50a38f330a39cc77bf2f1f2.png)

![暗黑模式](https://static.iiter.cn/article/299544aeabd67fbeb3c7910b6ae95deb.png)

![多模型切换](https://static.iiter.cn/article/1cd7fd1f5166cdb4e819ceccb0120435.png)

![输入框展开编辑](https://static.iiter.cn/article/fea9a90870b3e6db432832f4bbf20c4b.png)

![网站公告](https://static.iiter.cn/article/1cfa69ba5ed169a3a71a1ecbfa2d8ed4.png)

![会员激活](https://static.iiter.cn/article/dd158c521adbfd2ddaee8f5a2c7bb3d2.png)

#### 信息修改

![昵称修改](https://static.iiter.cn/article/b0107600b04c309b6b20e22ef8aa4cc8.png)

![头像修改](https://static.iiter.cn/article/1af022cc187c784e0ab2148d9e09f1b4.png)

#### 数据同步

![拉取](https://static.iiter.cn/article/6d2b1c848a230f135757ac61ab78bb5e.png)

![推送](https://static.iiter.cn/article/845ceb09434aad129ef395ce7d48f015.png)

#### 系统角色

![内置角色](https://static.iiter.cn/article/e2755b60bbe04164bb01b958fc34e9a1.png)

![公开](https://static.iiter.cn/article/d9fb85809c327721182833709e9109e1.png)

![自定义](https://static.iiter.cn/article/5a202cf160de4b4d1708ca810e3a348c.png)

![创建系统角色](https://static.iiter.cn/article/c52f0dcaa9177593c03b46113a12e9ce.png)

![系统角色可视化](https://static.iiter.cn/article/ddf8e98a2f5f94383c5460f7688c02dc.png)

#### 内容分享

![链接分享](https://static.iiter.cn/article/4cc220c9bf5592042451fce0ac6fbded.png)

![链接分享成功](https://static.iiter.cn/article/71277336a0e50c4571f2842bc056125a.png)

![输入密码方可访问](https://static.iiter.cn/article/a128ad00ca7ae35ae04325e0e11b631c.png)

![输入密码后展示分享内容](https://static.iiter.cn/article/c4170d7ba532621290d561ae48c12431.png)

![分享内容管理](https://static.iiter.cn/article/53915939a91c87656aa7f417223e1ce6.png)

![截图分享](https://static.iiter.cn/article/d12d653b953400e03bf8065e3f54fccd.png)

![截图成功](https://static.iiter.cn/article/8bd1c4f7ac8777bb9699555b646f2b12.png)

### 后台管理

![统计分析](https://static.iiter.cn/article/d7e41998ee11794e39ea1e80374bf35d.png)

![用户管理](https://static.iiter.cn/article/c0275e5107d2abe6638d43d42bfa7234.png)

![用户管理-开会员](https://static.iiter.cn/article/da6a485dc01ddfa1e3019b856e0e666f.png)

![用户管理-详情](https://static.iiter.cn/article/867a6f5de2d7ea3ae15280930bcd620a.png)

![用户管理-用户指定日期调用时间记录](https://static.iiter.cn/article/6d3444109ed824ac82e6fa1aa3e12208.png)

![卡密管理](https://static.iiter.cn/article/54f08ab978b705adacea3259d30147b9.png)

![批量生成卡密](https://static.iiter.cn/article/f4fb7c9ee762696d65f010eca6a33bf1.png)

![会员管理](https://static.iiter.cn/article/d55d5b20fd08d595fa066868dbfd875b.png)

![系统角色管理](https://static.iiter.cn/article/b171b6a352a8d74088becdabb46fac77.png)

![公告管理](https://static.iiter.cn/article/7091acf584569f3aa48d9539d82894a1.png)

![内容分享管理](https://static.iiter.cn/article/9a4e194555192581a480bd089257e9c7.png)

![网站更新记录维护](https://static.iiter.cn/article/f73e6deb81822a9ddbddb37549bd5c32.png)

![模型管理](https://static.iiter.cn/article/a18caa0ab0d4aefe78fae3c009f7faba.png)

### 移动端兼容

<div align="center">
  <img src="https://static.iiter.cn/article/ba3bb0b1acfb0fee1a5bf398844cc468.png" alt="移动端对话管理" style="width: 45%;">
  <img src="https://static.iiter.cn/article/a6df8eb4ce0d41777a7a14442dbce7e7.png" alt="移动端内容生成" style="width: 45%;">
  <img src="https://static.iiter.cn/article/3a153818600b530bd60d3b12abf53593.png" alt="移动端内容生成" style="width: 45%;">
  <img src="https://static.iiter.cn/article/ad0672cbd74f34b7e1fcc7d67fd35e8e.png" alt="移动端内容生成" style="width: 45%;">
  <img src="https://static.iiter.cn/article/31825e42266893c52b29d9e1dd6c68cd.png" alt="移动端内容生成" style="width: 45%;">
</div>

</details>

## 技术栈

### 客户端

`Vue3` + `Element Plus` + `Pinia` + `Unocss`

### 服务端

`Express` + `MongoDB`

## 目录结构

### 客户端

`/src/assets` 静态资源

`/src/components` 公共组件

`/src/hooks` 公共 hooks

`/src/router` 路由配置

`/src/service` 接口请求、响应拦截器

`/src/stores` 状态管理

`/src/utils` 全局工具类

`/src/views` 页面

### 服务端

`/src/constant` 常量

`/src/schema` MongoDB 数据库 schema

`/src/routes` 路由

- `/admin` 后台管理目录
- `/share` 内容分享目录、静态内容生成
- `wechat.ts` 公众号验证、获取验证码、登录校验
- `home.ts` 用户登录状态校验、获取网站公告
- `chat.ts` 大模型对话
- `user.ts` 用户信息相关
- `notice.ts` 网站公告
- `timeline.ts` 时间线
- `vip.ts` 会员相关
- `system_role.ts` 系统角色
- `sync.ts` 数据同步

`/src/store` node-cache 配置，主要用于验证码的生成及校验

`/src/utils` 工具类

`.env.example` 配置文件示例，请创建自己的 `.env` 文件

`app.ts` 服务端应用入口，可配置端口、跨域等

## 安装部署

### 本地开发

克隆项目

```bash
git clone git@github.com:isnl/EsChatPro.git
```

**服务端**

进入服务端根目录

```bash
cd server
```

安装依赖

```bash
npm install
```

**重要:** 数据库依赖 `MongoDB` ，开发及部署之前需确保数据库正常运行，且完成上述的前置要求

启动服务端

```bash
npm run dev
```

---

启动服务端后，按如下操作执行数据库初始化脚本：

此操作为插入一条 `后台管理员数据` 及 `后台管理动态路由数据`，管理员数据可以修改，动态路由数据不能修改

脚本路径为：`scripts/init-mongo.js`

```bash
npm run init-mongo
```

**客户端**

进入客户端根目录

```bash
cd client
```

安装依赖

```bash
npm install
```

启动客户端

```bash
npm run dev
```

---

## 本地构建

**客户端构建**

进入客户端根目录

```bash
cd client
```

执行构建命令

```bash
npm run build
```

此时会在 `服务端根目录下` 生成客户端的构建产物 `clientDist`

---

**服务端构建**

进入服务端根目录

```bash
cd server
```

执行构建命令

```bash
npm run build
```

此时会在服务端根目录产生两个构建产物 `app.mjs` 和 `app.mjs.map`

接下来使用如下命令启动服务即可

```bash
npm start
```

当然，你也可以使用 `pm2` 来守护进程，防止进程被杀死

```bash
pm2 start npm --name ai -- start
```

### Docker

```bash
docker pull webpeanut/eschat_pro

docker run -d --name eschat_pro \
  -p 3300:3300  \
  -e MongoURI=mongodb://localhost:27017/eschat \
  -e WECHAT_TOKEN=YOUR_WECHAT_TOKEN \
  -e JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY \
  -e MAX_LENGTH=2000 \
  -e DAILY_LIMIT=20 \
  -e VIP_MAX_LENGTH=10000 \
  -e VIP_DAILY_LIMIT=99 \
  -e SHARE_MAX_COUNT=5 \
  webpeanut/eschat_pro
```

如果你需要指定其他环境变量，请自行在上述命令中增加 -e 环境变量=环境变量值 来指定。

## 注意事项

### 公众号用户设置管理员

用自己微信扫码登录后，使用 `MongoDB Compass` 或其他数据库终端连接数据库，在 `user` 集合中找到自己，并将 `role` 字段设置为 1 即可

### 非公众号授权登录方式 新建用户

用 `MongoDB Compass` 或其他数据库终端连接数据库，并在 `user` 集合中新增如下数据，`openId` 为授权码字段，自行生成，长度和内容随机，确保唯一性即可。

```json
{
  "openId": "GA02rPMrA",
  "id": "poRElv1koxGkvYriOlM61",
  "avatar": "E053",
  "name": "GFN1E-ChatGPTer",
  "createdAt": "2024-04-05 15:38:15"
}
```

### 添加管理员用户

同样的， `user` 集合中新增如下数据，`openId` 为授权码字段，自行生成，长度和内容随机，确保唯一性即可。role 字段为 1

```json
// role: 权限字段，1为管理员，0为普通用户，默认为普通用户
{
  "openId": "GA02rPMrA",
  "id": "poRElv1koxGkvYriOlM61",
  "avatar": "E053",
  "name": "GFN1E-ChatGPTer",
  "createdAt": "2024-04-05 15:38:15",
  "role": 1
}
```

### 添加 AI 大模型

进入后台管理 -> 模型管理 -> 新建模型

## 常见问题

`Q`： 部署后为啥不是流式响应

`A`： 检查 `nginx` 配置

```nginx
proxy_buffering off;
chunked_transfer_encoding on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 65;
```

---

`Q`： 授权码登录方式，授权码在哪创建？

`A`： 系统运行后，用 `MongoDB Compass` 或其他数据库终端连接数据库，并在 `user` 集合中新增如下数据，`openId` 为授权码字段，自行生成，长度和内容随机，确保唯一性即可。
哦对了，如果你想给你自己的账号添加管理员权限，请再添加 role 字段，值为 1

```json
// 权限字段，1为管理员，0为普通用户
{
  "openId": "GA02rPMrA",
  "id": "poRElv1koxGkvYriOlM61",
  "avatar": "E053",
  "name": "GFN1E-ChatGPTer",
  "createdAt": "2024-04-05 15:38:15",
  "role": 1
}
```

---

`Q`： 除了微信公众号和授权码登录方式外，能不能让用户自己注册账号自行使用？

`A`： 参考 `server/src/schema/user.ts` 和 `server/src/routes/user.ts` 文件，自行开发注册相关功能即可

---

`Q`： 能不能给指定的用户单独设置每日调用次数和文本长度限制？

`A`： 需要写点代码，在后台用户管理中，将调用次数和文本长度字段存入数据库中的用户表里。并在如下文件中（`server/src/routes/gpt.ts`）用户调用 AI 生成内容的时候，先根据用户 id 获取到用户信息，再将调用次数和文本长度限制改为从用户信息中获取的方式即可

- process.env.MAX_LENGTH -> 用户信息中的 MAX_LENGTH
- process.env.DAILY_LIMIT -> 用户信息中的 DAILY_LIMIT

---

`Q`： Docker 部署，如何查看镜像文件夹中的内容

`A`： 要查看 Docker 镜像中的内容，你可以通过以下步骤操作：

首先，使用以下命令列出本地的 Docker 镜像：

```bash
docker images
```

找到你想要查看的镜像的 REPOSITORY 和 TAG。

使用以下命令创建并启动一个临时容器，使得你能够在其中查看镜像中的文件内容：

```
docker run -it --rm webpeanut/eschat_pro sh
```

这将创建并启动一个新的容器，并进入容器的 shell 命令行界面。

在容器的命令行界面中，你可以使用标准的 Linux 命令来查看镜像中的文件内容，例如 `ls` 命令来列出目录中的文件。

通过以上步骤，你可以在容器中查看 Docker 镜像中的文件内容。

---

`Q`： 没有服务器和域名怎么办？

`A`： 买！阿里云现在服务器价格新老用户都很便宜
2 核 4G，5M 固定带宽，80G ESSD Entry 盘一年只需要`199`（企业用户），2 核 2G，3M 固定带宽，40G ESSD Entry 盘只需 `99`(个人企业同享)  
不是哥们，这价格你敢信！！！ 最重要的是 `续费同价`，这你受得了吗！

当然，新用户更优惠，`.com域名 + 2核2G ECS包年` 只需 `99`，`99` 你买不了吃亏，买不了上当

[点击即刻购买](https://www.aliyun.com/daily-act/ecs/activity_selection?userCode=56gyhchh)

## 免责声明

本系统仅供学习和研究目的使用，在选择接入模型时，请遵循当地法律法规，尊重他人的合法权益，不得用于任何违法违规活动。如因使用本系统而产生的任何法律责任，由使用者自行承担。

## 支持作者

`EsChatPro` 是一款完全免费无广告的开源软件，软件开发和维护全靠作者用爱发电，因此您可以选择支持作者让作者有更多的热情和精力维护此软件，或者您使用了此软件进行了盈利，欢迎您通过下面的方式支持作者：

### Alipay

<img src="https://static.iiter.cn/alipay.jpg" width="200" style="margin-right: 100px;"/>

### Wepay

<img src="https://static.iiter.cn/wepay.jpg" width="200" />

## LICENSE

[MIT](https://opensource.org/license/mit/)


