import { IsNumber, IsString, IsUUID } from 'class-validator'

export class CreatePaymentDto {
	@IsUUID()
	enrollmentId: string

	@IsString()
	documentNumber: string

	@IsNumber()
	amount: number
}
