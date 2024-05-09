import { IsOptional, IsString } from "class-validator";

export class CreateAdditionalInfo {
    @IsOptional()
    @IsString()
    telephone: string
}