import { Controller, Get, Post, Body, Patch, Param, Query, } from '@nestjs/common';
import { CreateContactMediumDto } from './dto/create-contact-medium.dto';
import { UpdateContactMediumDto } from './dto/update-contact-medium.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { ContactMediumsService } from './contact-mediums.service';

@Controller('contact-mediums')
export class ContactMediumsController {
  constructor(private readonly contactMediumsService: ContactMediumsService) { }

  @Post()
  create(@Body() createContactMediumDto: CreateContactMediumDto) {
    return this.contactMediumsService.create(createContactMediumDto);
  }

  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.contactMediumsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactMediumsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactMediumDto: UpdateContactMediumDto) {
    return this.contactMediumsService.update(+id, updateContactMediumDto);
  }
}
