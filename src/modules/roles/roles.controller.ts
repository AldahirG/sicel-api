import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.rolesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
}
