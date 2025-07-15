部署 Geetest 过码验证，供公主连结B服玩家手动过码使用。

根据 [watermellye/vercel-captcha-helper](https://github.com/watermellye/vercel-captcha-helper) 修改，可以让该项目运行在一般的服务器

## 部署方式

1. git clone 本项目

2. 安装好node和pnpm，以及radis

3. 复制 .env.example 为 .env, 按照注释配置

4. 执行 `pnpm i` 安装依赖 

5. 执行 `pnpm start` 启动项目

6. 访问 `http://localhost:3000` ，但是需要配置好反向代理，需要在公网上访问到才能使用
