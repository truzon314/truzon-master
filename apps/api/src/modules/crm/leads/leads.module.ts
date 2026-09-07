import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { LeadAssignmentsModule } from '../assignments/assignments.module';
import { LeadFollowUpsModule } from '../followups/followups.module';
import { LeadActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [
    PrismaModule,
    LeadAssignmentsModule,
    LeadFollowUpsModule,
    LeadActivitiesModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}