import { IsBoolean, IsOptional } from 'class-validator'

export class FilterLeadDto {
	@IsOptional()
	@IsBoolean()
	'with-timeline': boolean

	@IsOptional()
	@IsBoolean()
	comments: boolean
}
