import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
} from '@nestjs/common'
import { StatesService } from './states.service'
import { CreateStateDto } from './dto/create-state.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'

@Controller('states')
export class StatesController {
	constructor(private readonly statesService: StatesService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createStateDto: CreateStateDto) {
		return this.statesService.create(createStateDto)
	}
	// states.controller.ts
@Get('by-country/:countryId')
findByCountry(@Param('countryId') countryId: string) {
  return this.statesService.findByCountryId(countryId);
}


	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.statesService.findAll(params)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.statesService.findOne(id)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.statesService.remove(id)
	}
}
