import { IsOptional, IsUUID } from "class-validator";
import { PaginationFilterDto } from "src/common/dto/pagination-filter.dto";

export class FilterCommentDto extends PaginationFilterDto {
    @IsOptional()
    @IsUUID()
    leadId?: string
}