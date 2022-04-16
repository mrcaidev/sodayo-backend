import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";
import { PaginationQueryDto } from "common/dto/pagination-query.dto";
import { OrderStatus } from "orders/constants/order-status.constant";
import { OrderType } from "orders/constants/order-type.constant";

export class FindOrderDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderType, { message: "订单类型错误" })
  type: OrderType;

  @IsOptional()
  @IsEnum(OrderStatus, { message: "订单状态错误" })
  status: OrderStatus;

  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  placedUserId: string;

  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  takenUserId: string;
}
