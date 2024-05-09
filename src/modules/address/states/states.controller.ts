import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StatesService } from './states.service';
import { CreateStateDto } from './dto/create-state.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) { }

  @Post()
  create(@Body() createStateDto: CreateStateDto) {
    return this.statesService.create(createStateDto);
  }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.statesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statesService.remove(id);
  }
}
