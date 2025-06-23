import { IsArray, IsUUID } from 'class-validator'

export class UpdatePromotorDto {
	@IsArray()
	leads: string[]

	@IsUUID()
	promotor: string
}
