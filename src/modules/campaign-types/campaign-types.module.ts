import { Module } from '@nestjs/common';
import { CampaignTypesService } from './campaign-types.service';
import { CampaignTypesController } from './campaign-types.controller';

@Module({
  controllers: [CampaignTypesController],
  providers: [CampaignTypesService],
})
export class CampaignTypesModule {}
