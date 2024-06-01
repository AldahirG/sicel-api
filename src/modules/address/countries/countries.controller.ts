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
import { CountriesService } from './countries.service'
import { CreateCountryDto } from './dto/create-country.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'

@Controller('countries')
export class CountriesController {
	constructor(private readonly countriesService: CountriesService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createCountryDto: CreateCountryDto) {
		return this.countriesService.create(createCountryDto)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.countriesService.findAll(params)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.countriesService.findOne(id)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.countriesService.remove(id)
	}
}
