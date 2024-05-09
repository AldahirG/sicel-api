import { IsString } from "class-validator";

export class CreateCampaignTypeDto {
    @IsString()
    name: string
}
