import { IsString, IsUUID } from "class-validator";

export class CreateAsetnameDto {
    @IsString()
    name: string

    @IsUUID()
    contactTypesId: string
}
