import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from '../cms/media/media.module';
import { TaxonomyModule } from '../cms/taxonomy/taxonomy.module';

@Module({
  imports: [PrismaModule, MediaModule, TaxonomyModule],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}