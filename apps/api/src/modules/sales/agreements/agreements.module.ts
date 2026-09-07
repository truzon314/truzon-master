import { Module } from '@nestjs/common';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { DocumentsModule } from '../../documents/documents.module';

@Module({
  imports: [PrismaModule, DocumentsModule],
  controllers: [AgreementsController],
  providers: [AgreementsService],
  exports: [AgreementsService],
})
export class AgreementsModule {}