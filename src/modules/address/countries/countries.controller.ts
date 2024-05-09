import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) { }

  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.countriesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
