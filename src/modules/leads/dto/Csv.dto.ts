import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
import { EnrollmentStatus, ReferenceTypes, SchoolTypes } from '@prisma/client'

export class ICsvDto {
	@IsString()
	FECHA_PRIMER_CONTACTO?: string

	@IsString() //!
	NOMBRE: string

	@IsString() //!
	GENERO: string

	@IsString() //!
	SEGUIMIENTO: string

	@IsString() //!
	TELEFONOS: string

	@IsString() //!
	CORREOS: string

	@IsString() //!
	CARRERA_INTERES: string

	@IsString() //!
	GRADO: string

	@IsString() //!
	ESCUELA_DE_PROCEDENCIA: string

	@IsEnum(SchoolTypes) //!
	TIPO_DE_ESCUELA: SchoolTypes

	@IsEnum(EnrollmentStatus)
	STATUS: EnrollmentStatus

	@IsString() //!
	SEMESTRE: string

	@IsString() //!
	AsetName: string

	@IsString()
	CAMPAIGN_NAME: string

	@IsString()
	CIUDAD: string

	@IsString()
	CICLO: string

	//! =========== References ==============

	//? Tipo de referido
	@IsEnum(ReferenceTypes)
	ES_REFERIDO: ReferenceTypes

	@IsString()
	NOMBRE_QUIEN_REFIERE: string

	//? DataSource
	@IsString()
	DONDE_OBT_DATO: string

	//! =======================================

	@IsUUID()
	PROMOTOR: string

	@IsDate()
	@Type(() => Date)
	CREATED_AT: Date
}
