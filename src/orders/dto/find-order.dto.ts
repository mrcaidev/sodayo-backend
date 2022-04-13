import { IsNumber, IsOptional } from "class-validator";
import { PaginationQueryDto } from "common/dto/pagination-query.dto";

export class FindOrderDto extends PaginationQueryDto {
  @IsOptional()
  @IsNumber({}, { message: "类型必须为数字" })
  type: number;

  @IsOptional()
  @IsNumber({}, { message: "状态必须为数字" })
  status: number;
}
