# Es Chat Pro，一个快速上手且极易部署的ChatGPT应用 🚀<!-- omit in toc -->

Easy Chat Pro， 一个极易部署的 GPT 开源应用，全量代码开源版本，可接入任何国内已备案过的且兼容OpenAI接口的大模型

注：此仓库需要配合服务端代码 [https://github.com/isnl/EsChatPro-Server](https://github.com/isnl/EsChatPro-Server)

## 版本特性 <!-- omit in toc -->

- [x] OPENAI 和 通义千问双模型可选
- [x] 支持暗黑主题 🌙
- [x] 完美的移动端兼容 📱
- [x] 打字机回复效果 ⌨️
- [x] 上下文对话支持，可创建多轮对话记录
- [x] 整段生成内容支持复制、代码复制、代码高亮
- [x] 双登录模式：
  - 1.关联公众号登录(个人订阅号即可) 
  - 2.普通的授权码登录模式(手动分发授权码) 
- [x] 自定义调用次数及文本输入上限
> 具体关于如何使用微信公众号实现网站登录可参考如下文章，非常详细
[https://juejin.cn/post/7234394174274158650](https://juejin.cn/post/7234394174274158650)
- [x] MongoDB数据库 
- [x] 后台仪表盘：使用分析、用户概览、调用日历 
- [x] 用户管理 
- [x] VIP会员管理 
- [x] 卡密管理：生成、激活 
- [x] 自定义系统角色、后台管理 
- [x] 内容分享管理、公告管理 、更新记录管理  

---
## 目录 <!-- omit in toc -->
- [前置要求，必看！](#前置要求必看)
  - [Node](#node)
- [截图展示](#截图展示)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [安装部署](#安装部署)
  - [本地开发](#本地开发)
- [本地构建](#本地构建)
- [常见问题](#常见问题)

---




## 前置要求，必看！

### Node

`node` 需要 `^16 || ^18 || ^19` 版本（`node >= 14` 需要安装 [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)），使用 [nvm](https://github.com/nvm-sh/nvm) 可管理本地多个 `node` 版本

```bash
node -v
```

## 截图展示

## 技术栈 

`Vue3` + `Element Plus` + `Pinia` + `Unocss`


## 目录结构

`/src/assets`  静态资源  

`/src/components` 公共组件  

`/src/hooks`   公共hooks  

`/src/router` 路由配置

`/src/service` 接口请求、响应拦截器

`/src/stores`  状态管理  

`/src/utils`   全局工具类

`/src/views`  页面


## 安装部署

### 本地开发

克隆项目

```bash
git clone git@github.com:isnl/EsChatPro-Web.git
```

安装依赖

```bash
npm install  
```

启动

```bash
npm run dev
```
---

## 本地构建

执行构建命令
```bash
npm run build
```

此时会在服务端根目录生成客户端的构建产物 `clientDist`

---


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

