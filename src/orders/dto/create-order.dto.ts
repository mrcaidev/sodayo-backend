import { IsEnum, IsNumber, IsString } from "class-validator";
import { OrderType } from "orders/constants/order-type.constant";

/**
 * 创建订单的 DTO。
 */
export class CreateOrderDto {
  /** 类型。 */
  @IsEnum(OrderType, { message: "订单类型错误" })
  type: OrderType;

  /** 描述。 */
  @IsString({ message: "描述必须为字符串" })
  description: string;

  /** 费用。 */
  @IsNumber({}, { message: "费用必须为数字" })
  cost: number;
}
