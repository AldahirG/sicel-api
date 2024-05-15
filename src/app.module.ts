import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientErrorFilter } from './common/exceptions/prisma-exception.filter';
import { RolesModule } from './modules/roles/roles.module';
import { ContactTypesModule } from './modules/contact-types/contact-types.module';
import { AsetnameModule } from './modules/asetname/asetname.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { FollowUpModule } from './modules/follow-up/follow-up.module';
import { CountriesModule } from './modules/address/countries/countries.module';
import { StatesModule } from './modules/address/states/states.module';
import { CitiesModule } from './modules/address/cities/cities.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CyclesModule } from './modules/cycles/cycles.module';
import { CareersModule } from './modules/careers/careers.module';
@Module({
  imports: [AuthModule,
    UsersModule,
    RolesModule,
    ContactTypesModule,
    AsetnameModule,
    CampaignsModule,
    FollowUpModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    LeadsModule,
    CyclesModule,
    CareersModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientErrorFilter,
    },
  ],
})
export class AppModule { }
