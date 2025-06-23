import { IsString, MinLength } from 'class-validator'

export class SearchLeadsDto {
	@IsString()
	@MinLength(2)
	query: string
}
