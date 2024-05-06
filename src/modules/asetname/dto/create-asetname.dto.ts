import { IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateAsetnameDto {
    @IsString()
    name: string

    @IsNumber()
    mediumId: number
}
