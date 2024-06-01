import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateTimeLineDto {
	@IsOptional()
	@IsString()
	title?: string

	@IsString()
	description: string

	@IsString()
	@IsUUID()
	timeableId: string

	@IsString()
	timeableModel: string

	@IsUUID()
	@IsString()
	leadId: string
}
