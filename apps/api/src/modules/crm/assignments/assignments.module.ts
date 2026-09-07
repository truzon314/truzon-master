import { Module } from '@nestjs/common';
import { LeadAssignmentsController } from './assignments.controller';
import { LeadAssignmentsService } from './assignments.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeadAssignmentsController],
  providers: [LeadAssignmentsService],
  exports: [LeadAssignmentsService],
})
export class LeadAssignmentsModule {}