import { redisClient } from '../config/redis';
import { createErrorResponse, CaptchaData } from '../types/index';

export const config = {
  runtime: 'edge',
};

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

    const data = await redisClient.get(user);
    
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
      // 没有找到数据
      return new Response(
        null,
        {
          status: 204,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Get API错误:', error);
    return new Response(
      JSON.stringify(createErrorResponse('服务器内部错误', 500)),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
