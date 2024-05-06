import { Controller, Get, Post, Body, Patch, Param,  Query } from '@nestjs/common';
import { AsetnameService } from './asetname.service';
import { CreateAsetnameDto } from './dto/create-asetname.dto';
import { UpdateAsetnameDto } from './dto/update-asetname.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

@Controller('aset-name')
export class AsetnameController {
  constructor(private readonly asetnameService: AsetnameService) { }

  @Post()
  create(@Body() createAsetnameDto: CreateAsetnameDto) {
    return this.asetnameService.create(createAsetnameDto);
  }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.asetnameService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asetnameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsetnameDto: UpdateAsetnameDto) {
    return this.asetnameService.update(+id, updateAsetnameDto);
  }
}
