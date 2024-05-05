import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientErrorFilter } from './common/exceptions/prisma-exception.filter';
import { RolesModule } from './modules/roles/roles.module';
@Module({
  imports: [AuthModule, UsersModule, RolesModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientErrorFilter,
    },
  ],
})
export class AppModule { }
