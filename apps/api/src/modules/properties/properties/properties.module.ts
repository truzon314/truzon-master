import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { MediaModule } from '../../cms/media/media.module';
import { TaxonomyModule } from '../../cms/taxonomy/taxonomy.module';

@Module({
  imports: [PrismaModule, MediaModule, TaxonomyModule],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}