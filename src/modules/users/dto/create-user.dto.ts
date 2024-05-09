import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateAdditionalInfo } from "./create-additional-info.dto";
import { Type } from "class-transformer";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    paternalSurname: string

    @IsOptional()
    @IsString()
    maternalSurname: string = ''

    @IsString()
    password: string;

    @IsArray()
    @IsOptional()
    roles?: number[]

    @ValidateNested({ each: true })
    @Type(() => CreateAdditionalInfo)
    additionalInfo: CreateAdditionalInfo[]
}
