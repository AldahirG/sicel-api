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
import { ChannelsService } from './channels.service'
import { CreateChannelDto } from './dto/create-channel.dto'
import { UpdateChannelDto } from './dto/update-channel.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post()
	create(@Body() createChannelDto: CreateChannelDto) {
		return this.channelsService.create(createChannelDto)
	}

	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.channelsService.findAll(params)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.channelsService.findOne(id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
		return this.channelsService.update(id, updateChannelDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.channelsService.remove(id)
	}
}
