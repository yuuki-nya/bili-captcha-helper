import { redisClient } from '../config/redis';
import { createErrorResponse, createSuccessResponse, CaptchaData } from '../types/index';

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    // 检查请求方法
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify(createErrorResponse('仅支持POST请求', 405)),
        {
          status: 405,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    const data: CaptchaData = await req.json();
    
    // 数据验证
    if (!data.gt_user) {
      return new Response(
        JSON.stringify(createErrorResponse('缺少gt_user字段', 400)),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    // 设置过期时间为30秒
    await redisClient.setEx(data.gt_user, 30, JSON.stringify(data));
    
    return new Response(
      JSON.stringify(createSuccessResponse(null, '验证码数据提交成功')),
      {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Submit API错误:', error);
    
    // 检查是否是JSON解析错误
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify(createErrorResponse('无效的JSON格式', 400)),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify(createErrorResponse('服务器内部错误', 500)),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
