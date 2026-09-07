import { Module } from '@nestjs/common';
import { MappingController } from './mapping.controller';
import { PublicMappingController } from './public-mapping.controller';
import { MappingService } from './mapping.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MappingController, PublicMappingController],
  providers: [MappingService],
  exports: [MappingService],
})
export class MappingModule {}