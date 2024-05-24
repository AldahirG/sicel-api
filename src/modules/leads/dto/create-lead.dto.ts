import {
	IsArray,
	IsEnum,
	IsOptional,
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
	scholarship? = ScholarshipEnum

	@IsOptional()
	@IsEnum(SemesterEnum)
	semester?: SemesterEnum

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
