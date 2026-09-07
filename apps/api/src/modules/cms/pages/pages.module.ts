import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { MediaModule } from '../media/media.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';

@Module({
  imports: [PrismaModule, MediaModule, TaxonomyModule],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}