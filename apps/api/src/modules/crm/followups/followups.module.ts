import { Module } from '@nestjs/common';
import { LeadFollowUpsController } from './followups.controller';
import { LeadFollowUpsService } from './followups.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeadFollowUpsController],
  providers: [LeadFollowUpsService],
  exports: [LeadFollowUpsService],
})
export class LeadFollowUpsModule {}