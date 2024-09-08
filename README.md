部署 Geetest 过码验证，供公主连结B服玩家手动过码使用。

根据 [watermellye/vercel-captcha-helper](https://github.com/watermellye/vercel-captcha-helper) 修改，可以让该项目运行在一般的服务器

## 部署方式

1. git clone 本项目

2. 安装好node和pnpm，以及radis

3. 项目根目录新建 `.env` 文件，配置好redis

   ```bash
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

4. 执行 `pnpm run dev` 
