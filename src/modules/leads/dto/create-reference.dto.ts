import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ReferenceTypes } from '@prisma/client'

export class CreateReferenceDto {
	@IsOptional()
	@IsEnum(ReferenceTypes)
	type?: ReferenceTypes

	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	dataSource?: string
}
