import { IsString } from "class-validator"

export class ICsvDto {
    @IsString()
    Nombre: string

    @IsString()
    Telefonos: string

    @IsString()
    Correos: string

    @IsString()
    AsetName: string

    @IsString()
    Campaña: string

    @IsString()
    Created_at: string

    @IsString()
    Grade: string

    @IsString()
    Promotor: string
}