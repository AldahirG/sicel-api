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
	Request,
	ParseUUIDPipe,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common'
import { LeadsService } from './leads.service'
import { CreateLeadDto } from './dto/create-lead.dto'
import { UpdateLeadDto } from './dto/update-lead.dto'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'

@Controller('leads')
export class LeadsController {
	constructor(private readonly leadsService: LeadsService) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Request() req, @Body() createLeadDto: CreateLeadDto) {
		return this.leadsService.create(createLeadDto, req.user)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.leadsService.findAll(params)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.leadsService.findOne(id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateLeadDto: UpdateLeadDto,
		@Request() req,
	) {
		return this.leadsService.update(id, updateLeadDto, req.user)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.leadsService.remove(id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id/assignment/:userId')
	assignment(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('userId', ParseUUIDPipe) userId: string,
	) {
		return this.leadsService.assignment(id, userId)
	}

	@UseGuards(JwtAuthGuard)
	@Post('file-share')
	@UseInterceptors(FileInterceptor('file'))
	CreateFromFileShare(@UploadedFile() file: Express.Multer.File) {
		return this.leadsService.CreateFromFileShare(file)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':leadId/reassignment/:userId')
	reassignment(
		@Param('leadId') leadId: string,
		@Param('userId', ParseUUIDPipe) userId: string,
		@Request() req: any,
	) {
		return this.leadsService.reassignment(leadId, userId, req.user)
	}
}
