import { createClient } from 'redis';
import { config as loadEnv } from 'dotenv';

loadEnv(); // 加载环境变量

// 环境变量验证
function validateEnvVars() {
  const requiredVars = ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`缺少必需的环境变量: ${missingVars.join(', ')}`);
  }
}

// 验证环境变量
validateEnvVars();

// 创建Redis客户端
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  // 性能优化配置
  socket: {
    connectTimeout: 5000, // 连接超时时间
  },
});

// Redis错误处理
redisClient.on('error', (err) => {
  console.error('Redis连接错误:', err);
});

redisClient.on('connect', () => {
  console.log('Redis连接成功');
});

redisClient.on('reconnecting', () => {
  console.log('Redis重新连接中...');
});

redisClient.on('ready', () => {
  console.log('Redis客户端就绪');
});

// 连接Redis
redisClient.connect().catch((err) => {
  console.error('Redis连接失败:', err);
  process.exit(1);
});

export { redisClient };