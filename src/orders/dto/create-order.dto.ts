import { IsEnum, IsNumber, IsString } from "class-validator";
import { OrderType } from "orders/constants/order-type.constant";

export class CreateOrderDto {
  @IsEnum(OrderType, { message: "订单类型错误" })
  type: OrderType;

  @IsString({ message: "描述必须为字符串" })
  description: string;

  @IsNumber({}, { message: "费用必须为数字" })
  cost: number;
}
