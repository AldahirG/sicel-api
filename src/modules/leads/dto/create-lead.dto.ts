import {
	IsArray,
	IsEnum,
	IsIn,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator'
import { CreateInformationLeadDto } from './create-information-lead.dto'
import { CreateReferenceDto } from './create-reference.dto'
import { Type } from 'class-transformer'
import { ScholarshipEnum } from '../enums/scholarship.enum'
import { SemesterEnum } from '../enums/semester.enum'

export class CreateLeadDto {

	@IsOptional()
	@Type(() => Date)
	dateContact?: Date;

	@IsOptional()
	@IsUUID()
	gradeId?: string

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
	@IsEnum(ScholarshipEnum)
	scholarship?: ScholarshipEnum

	@IsOptional()
	@IsEnum(SemesterEnum)
	semester?: SemesterEnum

	@IsOptional()
	@IsUUID()
	cycleId: string

	@IsOptional()
	@IsUUID()
	userId?: string

	@IsOptional()
	@Type(() => CreateReferenceDto)
	@ValidateNested({ each: true })
	reference?: CreateReferenceDto

	@Type(() => CreateInformationLeadDto)
	@ValidateNested({ each: true })
	information: CreateInformationLeadDto

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	email?: string[]

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	phone?: string[]

	// ✅ NUEVOS CAMPOS

@IsOptional()
@IsString()
program?: string;

@IsOptional()
@IsIn(['INTERNO', 'EXTERNO'])
intern?: string;

}
