import { CampaignsTypes } from '@prisma/client';
import { IsString, IsEnum } from 'class-validator';

export class CreateCampaignDto {
    @IsString()
    name: string

    @IsEnum(CampaignsTypes)
    type: CampaignsTypes
}
