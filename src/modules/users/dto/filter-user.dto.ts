import { IsNumber, IsNumberString, IsOptional } from 'class-validator'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'

export class FilterUserDTO extends PaginationFilterDto {
	@IsOptional()
	@IsNumberString()
	role?: string
}
