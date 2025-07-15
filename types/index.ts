// 验证码数据接口
export interface CaptchaData {
  gt_user: string;
  challenge?: string;
  validate?: string;
  seccode?: string;
  [key: string]: any;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 错误响应接口
export interface ErrorResponse {
  error: string;
  code?: number;
  timestamp?: string;
}

// 统一错误响应创建函数
export function createErrorResponse(error: string, code?: number): ErrorResponse {
  return {
    error,
    code,
    timestamp: new Date().toISOString()
  };
}

// 统一成功响应创建函数
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}