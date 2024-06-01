import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { RolesService } from './roles.service'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'

@Controller('roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.rolesService.findAll(params)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rolesService.findOne(+id)
	}
}
