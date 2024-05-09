import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { AsetnameService } from './asetname.service';
import { CreateAsetnameDto } from './dto/create-asetname.dto';
import { UpdateAsetnameDto } from './dto/update-asetname.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('aset-name')
export class AsetnameController {
  constructor(private readonly asetnameService: AsetnameService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAsetnameDto: CreateAsetnameDto) {
    return this.asetnameService.create(createAsetnameDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.asetnameService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asetnameService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsetnameDto: UpdateAsetnameDto) {
    return this.asetnameService.update(id, updateAsetnameDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asetnameService.remove(id);
  }
}
