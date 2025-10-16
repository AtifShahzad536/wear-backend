import 'dotenv/config';

const rawCorsOrigin = process.env.CORS_ORIGIN || '*';
const parsedCorsOrigins = rawCorsOrigin
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOriginValue = parsedCorsOrigins.length === 0
  ? '*'
  : parsedCorsOrigins.includes('*')
    ? '*'
    : parsedCorsOrigins.length === 1
      ? parsedCorsOrigins[0]
      : parsedCorsOrigins;

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiKey: process.env.OPENAI_API_KEY || '',
  corsOrigin: corsOriginValue,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
};
