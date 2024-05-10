import { EnrollmentStatus, Genres, SchoolTypes } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInformationLeadDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsEnum(Genres)
    genre?: Genres

    @IsOptional()
    @IsString()
    careerInterest?: string

    @IsOptional()
    @IsString()
    formerSchool?: string

    @IsOptional()
    @IsEnum(SchoolTypes)
    typeSchool?: SchoolTypes

    @IsOptional()
    @IsEnum(EnrollmentStatus)
    enrollmentStatus?: EnrollmentStatus

    @IsOptional()
    @IsUUID()
    followUpId?: string
}