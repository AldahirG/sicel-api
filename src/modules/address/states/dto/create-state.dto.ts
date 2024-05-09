import { IsString, IsUUID } from "class-validator";

export class CreateStateDto {
    @IsString()
    name: string

    @IsUUID()
    countryId: string
}
