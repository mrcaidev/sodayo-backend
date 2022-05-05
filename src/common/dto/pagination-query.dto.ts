import { IsOptional, IsPositive } from "class-validator";

/**
 * 分页查询的 DTO。
 */
export class PaginationQueryDto {
  /** 一页数据量。 */
  @IsOptional()
  @IsPositive()
  limit: number;

  /** 页起始偏移量。 */
  @IsOptional()
  offset: number;
}
