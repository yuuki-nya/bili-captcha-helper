部署 Geetest 过码验证，供公主连结B服玩家手动过码使用。

根据 [watermellye/vercel-captcha-helper](https://github.com/watermellye/vercel-captcha-helper) 修改，可以让该项目运行在一般的服务器

## 部署方式

1. git clone 本项目
2. 安装好node和pnpm，以及radis
3. 编辑.env，配置好redis连接信息
4. 执行 `pnpm run dev` 
