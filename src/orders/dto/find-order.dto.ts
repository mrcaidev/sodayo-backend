import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";
import { PaginationQueryDto } from "common/dto/pagination-query.dto";
import { OrderStatus } from "orders/constants/order-status.constant";
import { OrderType } from "orders/constants/order-type.constant";

/**
 * 查询订单的 DTO。
 */
export class FindOrderDto extends PaginationQueryDto {
  /** 类型。 */
  @IsOptional()
  @IsEnum(OrderType, { message: "订单类型错误" })
  type: OrderType;

  /** 状态。 */
  @IsOptional()
  @IsEnum(OrderStatus, { message: "订单状态错误" })
  status: OrderStatus;

  /** 下此单的用户 ID。 */
  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  placedUserId: string;

  /** 接此单的用户 ID。 */
  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  takenUserId: string;
}
