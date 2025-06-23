import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseUUIDPipe,
} from '@nestjs/common'
import { PromotionsService } from './promotions.service'
import { CreatePromotionDto } from './dto/create-promotion.dto'
import { UpdatePromotionDto } from './dto/update-promotion.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'

@Controller('promotions')
export class PromotionsController {
	constructor(private readonly promotionsService: PromotionsService) {}

	@Post()
	create(@Body() createPromotionDto: CreatePromotionDto) {
		return this.promotionsService.create(createPromotionDto)
	}

	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.promotionsService.findAll(params)
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.promotionsService.findOne(id)
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updatePromotionDto: UpdatePromotionDto,
	) {
		return this.promotionsService.update(id, updatePromotionDto)
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.promotionsService.remove(id)
	}
}
