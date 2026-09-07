import { Module } from '@nestjs/common';
import { ChannelPartnersController } from './channel-partners.controller';
import { ChannelPartnersService } from './channel-partners.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ChannelPartnersController],
  providers: [ChannelPartnersService],
  exports: [ChannelPartnersService],
})
export class ChannelPartnersModule {}