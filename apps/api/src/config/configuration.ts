export default () => ({
  // App
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: 'api',
  apiVersion: '1',

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key-change-in-production',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    refreshTokenCookieName: 'refresh_token',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  // CORS
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002',

  // Throttle
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },

  // Email (SMTP)
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@truzonhomes.com',
    fromName: process.env.SMTP_FROM_NAME || 'Truzon Homes',
  },

  // File Storage (GCS)
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'GCS',
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucket: process.env.GCS_BUCKET,
      keyFile: process.env.GCS_KEY_FILE,
    },
    r2: {
      accountId: process.env.R2_ACCOUNT_ID,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      bucket: process.env.R2_BUCKET,
      publicUrl: process.env.R2_PUBLIC_URL,
    },
    local: {
      uploadDir: process.env.LOCAL_UPLOAD_DIR || './uploads',
      publicUrl: process.env.LOCAL_PUBLIC_URL || 'http://localhost:3000/media-files',
    },
  },

  // Push Notifications
  push: {
    firebase: {
      serverKey: process.env.FIREBASE_SERVER_KEY,
    },
    apns: {
      keyId: process.env.APNS_KEY_ID,
      teamId: process.env.APNS_TEAM_ID,
      bundleId: process.env.APNS_BUNDLE_ID,
      keyPath: process.env.APNS_KEY_PATH,
    },
  },

  // SMS/WhatsApp (Twilio)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  },

  // Frontend URLs (for email links, etc.)
  frontend: {
    adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
    publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
    proCpUrl: process.env.PRO_CP_URL || 'http://localhost:3002',
  },

  // Feature Flags
  features: {
    enableTwoFactor: process.env.ENABLE_2FA === 'true',
    enablePublicApi: process.env.ENABLE_PUBLIC_API !== 'false',
    enableWebhooks: process.env.ENABLE_WEBHOOKS === 'true',
  },
});