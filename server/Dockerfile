# base image
# FROM
FROM node:18-alpine

ENV MongoURI=mongodb://localhost:27017/eschat \
    WECHAT_TOKEN=YOUR_WECHAT_TOKEN \
    JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY \
    MAX_LENGTH=2000 \
    DAILY_LIMIT=20 \
    VIP_MAX_LENGTH=10000 \
    VIP_DAILY_LIMIT=99 \
    SHARE_MAX_COUNT=5

# 设置工作目录
WORKDIR /usr/src/eschat_pro

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install --registry=https://registry.npmmirror.com/

# 复制应用程序源代码到工作目录
COPY . .

# 容器对外暴露的端口号
EXPOSE 3300

# 开始命令
CMD ["npm", "run", "start"]