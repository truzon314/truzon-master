import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development'),

  // Database
  DATABASE_URL: Joi.string().uri().required(),

  // JWT
  JWT_SECRET_KEY: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_DB: Joi.number().default(0),

  // CORS
  CORS_ORIGINS: Joi.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002'),

  // Throttle
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(100),

  // SMTP (optional for dev)
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASSWORD: Joi.string().allow('').optional(),
  SMTP_FROM_EMAIL: Joi.string().email().default('noreply@truzonhomes.com'),
  SMTP_FROM_NAME: Joi.string().default('Truzon Homes'),

  // Storage
  STORAGE_PROVIDER: Joi.string().valid('GCS', 'R2', 'LOCAL').default('GCS'),
  GCS_PROJECT_ID: Joi.string().allow('').optional(),
  GCS_BUCKET: Joi.string().allow('').optional(),
  GCS_KEY_FILE: Joi.string().allow('').optional(),
  R2_ACCOUNT_ID: Joi.string().allow('').optional(),
  R2_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  R2_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  R2_BUCKET: Joi.string().allow('').optional(),
  R2_PUBLIC_URL: Joi.string().uri().allow('').optional(),
  LOCAL_UPLOAD_DIR: Joi.string().default('./uploads'),
  LOCAL_PUBLIC_URL: Joi.string().uri().default('http://localhost:3000/media-files'),

  // Push
  FIREBASE_SERVER_KEY: Joi.string().allow('').optional(),
  APNS_KEY_ID: Joi.string().allow('').optional(),
  APNS_TEAM_ID: Joi.string().allow('').optional(),
  APNS_BUNDLE_ID: Joi.string().allow('').optional(),
  APNS_KEY_PATH: Joi.string().allow('').optional(),

  // Twilio
  TWILIO_ACCOUNT_SID: Joi.string().allow('').optional(),
  TWILIO_AUTH_TOKEN: Joi.string().allow('').optional(),
  TWILIO_PHONE_NUMBER: Joi.string().allow('').optional(),
  TWILIO_WHATSAPP_NUMBER: Joi.string().allow('').optional(),

  // Frontend URLs
  ADMIN_URL: Joi.string().uri().default('http://localhost:3001'),
  PUBLIC_URL: Joi.string().uri().default('http://localhost:3000'),
  PRO_CP_URL: Joi.string().uri().default('http://localhost:3002'),

  // Features
  ENABLE_2FA: Joi.boolean().default(false),
  ENABLE_PUBLIC_API: Joi.boolean().default(true),
  ENABLE_WEBHOOKS: Joi.boolean().default(false),
});