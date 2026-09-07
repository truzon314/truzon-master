import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { MediaModule } from '../media/media.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';

@Module({
  imports: [PrismaModule, MediaModule, TaxonomyModule],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}