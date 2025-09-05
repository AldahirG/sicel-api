import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseIntPipe,
	ParseUUIDPipe,
} from '@nestjs/common'
import { ListsService } from './lists.service'
import { CreateListDto } from './dto/create-list.dto'
import { UpdateListDto } from './dto/update-list.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'

@Controller('lists')
export class ListsController {
	constructor(private readonly listsService: ListsService) {}

	@Post()
	create(@Body() createListDto: CreateListDto) {
		return this.listsService.create(createListDto)
	}

	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.listsService.findAll(params)
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.listsService.findOne(id)
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateListDto: UpdateListDto,
	) {
		return this.listsService.update(id, updateListDto)
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.listsService.remove(id)
	}
}
