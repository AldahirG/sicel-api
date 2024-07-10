import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class FilterLeadDto extends PaginationFilterDto {
	@IsOptional()
	@IsBoolean()
	'with-timeline': boolean

	@IsOptional()
	@IsBoolean()
	comments: boolean
}
