import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientErrorFilter } from './common/exceptions/prisma-exception.filter';
import { RolesModule } from './modules/roles/roles.module';
import { GradesModule } from './modules/grades/grades.module';
import { AsetnameModule } from './modules/asetname/asetname.module';
import { ContactMediumsModule } from './modules/contact-mediums/contact-mediums.module';
import { FollowUpModule } from './modules/follow-up/follow-up.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CareersModule } from './modules/careers/careers.module';
@Module({
  imports: [AuthModule, UsersModule, RolesModule, GradesModule, AsetnameModule, ContactMediumsModule, FollowUpModule, CampaignsModule, CareersModule,],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientErrorFilter,
    },
  ],
})
export class AppModule { }
