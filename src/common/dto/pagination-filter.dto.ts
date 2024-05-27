import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PaginationFilterDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  paginated?: true;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  'per-page' = 10;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number = 1;
}
