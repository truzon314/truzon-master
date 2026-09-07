import { Module } from '@nestjs/common';
import { LeadActivitiesController } from './activities.controller';
import { LeadActivitiesService } from './activities.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeadActivitiesController],
  providers: [LeadActivitiesService],
  exports: [LeadActivitiesService],
})
export class LeadActivitiesModule {}