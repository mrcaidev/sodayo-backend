import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
  @IsNumber({}, { message: "订单类型必须为数字" })
  type: number;

  @IsString({ message: "描述必须为字符串" })
  description: string;

  @IsNumber({}, { message: "费用必须为数字" })
  cost: number;

  @IsUUID(4, { message: "用户ID格式错误" })
  placedUserId: string;
}
