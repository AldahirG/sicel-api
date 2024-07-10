import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCommentDto {
    @IsOptional()
    @IsString()
    title?: string = 'Comentario'

    @IsString()
    description: string

    @IsUUID()
    leadId: string
}
