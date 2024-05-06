import { IsString } from "class-validator";

export class CreateContactMediumDto {
    @IsString()
    type: string
}
