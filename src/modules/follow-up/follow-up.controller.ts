import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('follow-up')
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFollowUpDto: CreateFollowUpDto) {
    return this.followUpService.create(createFollowUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.followUpService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followUpService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowUpDto: UpdateFollowUpDto) {
    return this.followUpService.update(id, updateFollowUpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followUpService.remove(id);
  }
}
