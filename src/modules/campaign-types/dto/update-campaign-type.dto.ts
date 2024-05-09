import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignTypeDto } from './create-campaign-type.dto';

export class UpdateCampaignTypeDto extends PartialType(CreateCampaignTypeDto) {}
