import { IsOptional, IsString } from "class-validator";

export class CreateCycleDto {
    @IsString()
    name: string

    @IsString()
    cycle: string
}
