import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigins = configService.get<string>('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001,http://localhost:3002').split(',');

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-share-password', 'X-Share-Password'],
  });

  // Global prefix & versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: nodeEnv === 'production',
  }));

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger documentation
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Truzon API')
      .setDescription('Centralized API for Truzon Platform')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addCookieAuth('refresh_token')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('roles', 'Role management')
      .addTag('permissions', 'Permission management')
      .addTag('leads', 'Lead management')
      .addTag('customers', 'Customer management')
      .addTag('projects', 'Project management')
      .addTag('properties', 'Property management')
      .addTag('inventory', 'Inventory management')
      .addTag('bookings', 'Booking management')
      .addTag('payments', 'Payment management')
      .addTag('agreements', 'Agreement management')
      .addTag('channel-partners', 'Channel partner management')
      .addTag('campaigns', 'Marketing campaigns')
      .addTag('pages', 'CMS pages')
      .addTag('blogs', 'Blog management')
      .addTag('media', 'Media management')
      .addTag('menus', 'Menu management')
      .addTag('forms', 'Form submissions')
      .addTag('settings', 'System settings')
      .addTag('notifications', 'Notifications')
      .addTag('documents', 'Documents')
      .addTag('reports', 'Reports & analytics')
      .addTag('audit', 'Audit logs')
      .addTag('public', 'Public API endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);
  console.log(`🚀 Truzon API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();