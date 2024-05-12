import { IsArray, IsDate, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CreateInformationLeadDto } from "./create-information-lead.dto";
import { CreateReferenceDto } from "./create-reference.dto";
import { Type } from "class-transformer";
import { Grades } from "@prisma/client";

export class CreateLeadDto {
    @IsOptional()
    @IsEnum(Grades)
    grade?: Grades

    @IsOptional()
    @IsUUID()
    asetNameId?: string

    @IsUUID()
    campaignId: string

    @IsOptional()
    @IsUUID()
    cityId?: string

    userId?: string

    @IsOptional()
    @Type(() => CreateReferenceDto)
    @ValidateNested({ each: true })
    reference?: CreateReferenceDto

    @Type(() => CreateInformationLeadDto)
    @ValidateNested({ each: true })
    information: CreateInformationLeadDto

    @IsArray()
    email: string[]

    @IsArray()
    phone: string[]

}
