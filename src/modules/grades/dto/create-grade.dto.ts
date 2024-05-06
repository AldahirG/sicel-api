import { IsString } from "class-validator";

export class CreateGradeDto {
    @IsString()
    name: string
}
