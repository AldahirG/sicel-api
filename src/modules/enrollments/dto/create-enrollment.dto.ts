import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateEnrollmentDto {
	@IsUUID()
	@IsNotEmpty()
	leadId: string

	@IsUUID()
	@IsNotEmpty()
	careersId: string

	@IsUUID()
	@IsNotEmpty()
	promotionId: string

	@IsUUID()
	@IsNotEmpty()
	channelId: string

	@IsUUID()
	@IsNotEmpty()
	listId: string

	@IsOptional()
	@IsString()
	curp?: string // ✅ corregido: antes estaba como CURP

	@IsOptional()
	@IsString()
	enrollment_folio?: string

	@IsOptional()
	@IsString()
	matricula?: string

	@IsOptional()
	@IsString()
	scholarship?: string // ✅ agregar si lo vas a recibir también

	@IsOptional()
	@IsString()
	comments?: string // ✅ agregar si lo vas a recibir también
}
