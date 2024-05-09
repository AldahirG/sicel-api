import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.citiesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
