import { Grades } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CreateInformationLeadDto } from "./create-information-lead.dto";
import { CreateReferenceDto } from "./create-reference.dto";

export class CreateLeadDto {
    @IsOptional()
    @IsEnum(Grades)
    grade?: Grades

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateContact?: Date

    @IsOptional()
    @IsUUID()
    asetNameId?: string


    @IsOptional()
    @IsUUID()
    campaignId?: string

    @IsOptional()
    @IsUUID()
    cityId?: string

    @IsOptional()
    @IsUUID()
    userId?: string

    @IsOptional()
    @Type(() => CreateReferenceDto)
    @ValidateNested({ each: true })
    reference?: CreateReferenceDto

    @IsOptional()
    @Type(() => CreateInformationLeadDto)
    @ValidateNested({ each: true })
    information?: CreateInformationLeadDto
}
