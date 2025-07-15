import express from 'express';
import { redisClient } from './config/redis';
import { createErrorResponse, createSuccessResponse, CaptchaData } from './types/index';

const app = express();
const port = process.env.PORT || 3000;

// 请求日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

app.use(express.json());

// 提交验证码数据
app.post('/api/submit', async (req, res) => {
  try {
    const data: CaptchaData = req.body;
    
    // 数据验证
    if (!data.gt_user) {
      return res.status(400).json(createErrorResponse('缺少gt_user字段', 400));
    }

    // 设置过期时间为30秒
    await redisClient.setEx(data.gt_user, 30, JSON.stringify(data));
    res.status(201).json(createSuccessResponse(null, '验证码数据提交成功'));
  } catch (error) {
    console.error('Submit API错误:', error);
    res.status(500).json(createErrorResponse('服务器内部错误', 500));
  }
});

// 获取验证码数据（非阻塞）
app.get('/api/get', async (req, res) => {
  try {
    const user = String(req.query.userid);
    
    if (!user || user === 'undefined') {
      return res.status(400).json(createErrorResponse('缺少用户ID参数', 400));
    }

    const data = await redisClient.get(user);
    
    if (data) {
      await redisClient.del(user);
      const captchaData: CaptchaData = JSON.parse(data);
      res.status(200).json(captchaData);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Get API错误:', error);
    res.status(500).json(createErrorResponse('服务器内部错误', 500));
  }
});

// 获取验证码数据（阻塞等待）
app.get('/api/block', async (req, res) => {
  try {
    const user = String(req.query.userid);
    
    if (!user || user === 'undefined') {
      return res.status(400).json(createErrorResponse('缺少用户ID参数', 400));
    }

    let data = await redisClient.get(user);
    const start = Date.now();
    const timeout = 28 * 1000; // 28秒超时
    
    // 轮询等待数据
    while (!data && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      data = await redisClient.get(user);
    }
    
    if (data) {
      await redisClient.del(user);
      const captchaData: CaptchaData = JSON.parse(data);
      res.status(200).json(captchaData);
    } else {
      res.status(503).json(createErrorResponse('请求超时，未获取到验证码数据', 503));
    }
  } catch (error) {
    console.error('Block API错误:', error);
    res.status(500).json(createErrorResponse('服务器内部错误', 500));
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
