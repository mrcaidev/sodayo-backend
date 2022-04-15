import { IsNumber, IsOptional, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";
import { PaginationQueryDto } from "common/dto/pagination-query.dto";

export class FindOrderDto extends PaginationQueryDto {
  @IsOptional()
  @IsNumber({}, { message: "类型必须为数字" })
  type: number;

  @IsOptional()
  @IsNumber({}, { message: "状态必须为数字" })
  status: number;

  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  placedUserId: string;

  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  takenUserId: string;
}
