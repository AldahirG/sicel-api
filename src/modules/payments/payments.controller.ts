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
import { PaymentsService } from './payments.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto'

@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createPaymentDto: CreatePaymentDto) {
		return this.paymentsService.create(createPaymentDto)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query() params: PaginationFilterDto) {
		return this.paymentsService.findAll(params)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.paymentsService.findOne(id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
		return this.paymentsService.update(id, updatePaymentDto)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.paymentsService.remove(id)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':enrollmentId/details')
	async getDetails(@Param('enrollmentId') enrollmentId: string) {
		return this.paymentsService.findByEnrollmentIdWithDetails(enrollmentId)
	}
}
