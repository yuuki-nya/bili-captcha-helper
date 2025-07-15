import { redisClient } from '../config/redis';
import { createErrorResponse, CaptchaData } from '../types/index';

export const config = {
  runtime: 'edge',
};

function sleep(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const user = String(url.searchParams.get("userid"));
    
    // 参数验证
    if (!user || user === 'null') {
      return new Response(
        JSON.stringify(createErrorResponse('缺少用户ID参数', 400)),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    let data = await redisClient.get(user);
    const start = Date.now();
    const timeout = 28 * 1000; // 28秒超时
    
    // 轮询等待数据
    while (!data && Date.now() - start < timeout) {
      await sleep(1000);
      data = await redisClient.get(user);
    }
    
    if (data) {
      // 删除已获取的数据
      await redisClient.del(user);
      const captchaData: CaptchaData = JSON.parse(data);
      
      return new Response(
        JSON.stringify(captchaData),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      );
    } else {
      // 超时响应
      return new Response(
        JSON.stringify(createErrorResponse('请求超时，未获取到验证码数据', 503)),
        {
          status: 503,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Block API错误:', error);
    return new Response(
      JSON.stringify(createErrorResponse('服务器内部错误', 500)),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
