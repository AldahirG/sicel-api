import { IsOptional, IsString } from "class-validator";

export class CreateCycleDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsString()
    cycle: string
}
