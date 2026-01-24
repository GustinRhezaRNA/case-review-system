import { Module } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [AuthMiddleware, PrismaService],
  exports: [AuthMiddleware],
})
export class AuthModule {}
