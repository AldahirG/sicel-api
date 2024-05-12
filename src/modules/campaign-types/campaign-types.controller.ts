import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CampaignTypesService } from './campaign-types.service';
import { CreateCampaignTypeDto } from './dto/create-campaign-type.dto';
import { UpdateCampaignTypeDto } from './dto/update-campaign-type.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('campaign-types')
export class CampaignTypesController {
  constructor(private readonly campaignTypesService: CampaignTypesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCampaignTypeDto: CreateCampaignTypeDto) {
    return this.campaignTypesService.create(createCampaignTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.campaignTypesService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignTypesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignTypeDto: UpdateCampaignTypeDto) {
    return this.campaignTypesService.update(id, updateCampaignTypeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignTypesService.remove(id);
  }
}
