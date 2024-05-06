import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, } from '@nestjs/common';
import { CreateContactMediumDto } from './dto/create-contact-medium.dto';
import { UpdateContactMediumDto } from './dto/update-contact-medium.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { ContactMediumsService } from './contact-mediums.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';

@Controller('contact-mediums')
export class ContactMediumsController {
  constructor(private readonly contactMediumsService: ContactMediumsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContactMediumDto: CreateContactMediumDto) {
    return this.contactMediumsService.create(createContactMediumDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.contactMediumsService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactMediumsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactMediumDto: UpdateContactMediumDto) {
    return this.contactMediumsService.update(+id, updateContactMediumDto);
  }
}
