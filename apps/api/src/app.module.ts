import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';

// Config
import configuration from './config/configuration';
import { validationSchema } from './config/validation';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LeadsModule } from './modules/crm/leads/leads.module';
import { CustomersModule } from './modules/crm/customers/customers.module';
import { ProjectsModule } from './modules/properties/projects/projects.module';
import { PropertiesModule } from './modules/properties/properties/properties.module';
import { InventoryModule } from './modules/properties/inventory/inventory.module';
import { EnquiriesModule } from './modules/sales/enquiries/enquiries.module';
import { SiteVisitsModule } from './modules/sales/site-visits/site-visits.module';
import { BookingsModule } from './modules/sales/bookings/bookings.module';
import { PaymentsModule } from './modules/sales/payments/payments.module';
import { AgreementsModule } from './modules/sales/agreements/agreements.module';
import { ChannelPartnersModule } from './modules/channel-partners/channel-partners.module';
import { CampaignsModule } from './modules/marketing/campaigns/campaigns.module';
import { PagesModule } from './modules/cms/pages/pages.module';
import { BlogsModule } from './modules/cms/blogs/blogs.module';
import { MediaModule } from './modules/cms/media/media.module';
import { MenusModule } from './modules/cms/menus/menus.module';
import { FormsModule } from './modules/cms/forms/forms.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { TaxonomyModule } from './modules/cms/taxonomy/taxonomy.module';
import { CareersModule } from './modules/cms/careers/careers.module';
import { GalleryModule } from './modules/cms/gallery/gallery.module';
import { TestimonialsModule } from './modules/cms/testimonials/testimonials.module';
import { MappingModule } from './modules/mapping/mapping.module';
import { PublicModule } from './modules/public/public.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    // Event emitter
    EventEmitterModule.forRoot(),

    // BullMQ for background jobs
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          db: config.get<number>('REDIS_DB', 0),
        },
      }),
    }),

    // Prisma
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    LeadsModule,
    CustomersModule,
    ProjectsModule,
    PropertiesModule,
    InventoryModule,
    EnquiriesModule,
    SiteVisitsModule,
    BookingsModule,
    PaymentsModule,
    AgreementsModule,
    ChannelPartnersModule,
    CampaignsModule,
    PagesModule,
    BlogsModule,
    MediaModule,
    MenusModule,
    FormsModule,
    SettingsModule,
    NotificationsModule,
    DocumentsModule,
    ReportsModule,
    AuditModule,
    TaxonomyModule,
    CareersModule,
    GalleryModule,
    TestimonialsModule,
    MappingModule,
    PublicModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}