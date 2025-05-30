import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({}), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, RefreshJwtStrategy],
})
export class UsersModule {}
