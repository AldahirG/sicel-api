import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CampaignTypesService } from './campaign-types.service';
import { CreateCampaignTypeDto } from './dto/create-campaign-type.dto';
import { UpdateCampaignTypeDto } from './dto/update-campaign-type.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';

@Controller('campaign-types')
export class CampaignTypesController {
  constructor(private readonly campaignTypesService: CampaignTypesService) { }

  @Post()
  create(@Body() createCampaignTypeDto: CreateCampaignTypeDto) {
    return this.campaignTypesService.create(createCampaignTypeDto);
  }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.campaignTypesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignTypeDto: UpdateCampaignTypeDto) {
    return this.campaignTypesService.update(id, updateCampaignTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignTypesService.remove(id);
  }
}
