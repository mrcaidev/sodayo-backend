import { IsEnum, IsNumber, IsString, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";
import { OrderType } from "orders/constants/order-type.constant";

export class CreateOrderDto {
  @IsEnum(OrderType, { message: "订单类型错误" })
  type: OrderType;

  @IsString({ message: "描述必须为字符串" })
  description: string;

  @IsNumber({}, { message: "费用必须为数字" })
  cost: number;
}

export class CreateOrderWithIdDto extends CreateOrderDto {
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  placedUserId: string;
}
