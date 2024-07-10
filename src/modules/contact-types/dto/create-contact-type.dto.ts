import { IsString } from 'class-validator'

export class CreateContactTypeDto {
	@IsString()
	name: string
}
