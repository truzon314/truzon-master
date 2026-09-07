import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { MediaModule } from '../../cms/media/media.module';
import { MappingModule } from '../../mapping/mapping.module';

@Module({
  imports: [PrismaModule, MediaModule, MappingModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}