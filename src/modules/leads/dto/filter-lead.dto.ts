import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class FilterLeadDto extends PaginationFilterDto {
	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	'with-timeline': false

	@IsOptional()
	@IsBoolean()
	@Type(() => Boolean)
	comments: false

	// Agregamos el followUp como filtro
	@IsOptional()
	@IsString()
	followUp?: string

	// Agregamos el medioContacto como filtro
	@IsOptional()
	@IsString()
	medioContacto?: string
}
