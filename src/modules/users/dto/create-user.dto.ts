import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    tel: string;

    @IsBoolean()
    status: boolean;

    @IsArray()
    @IsOptional()
    roles?: number[]
}
