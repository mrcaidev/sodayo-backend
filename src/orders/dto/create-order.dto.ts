import { IsNumber, IsString, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";

export class CreateOrderDto {
  @IsNumber({}, { message: "订单类型必须为数字" })
  type: number;

  @IsString({ message: "描述必须为字符串" })
  description: string;

  @IsNumber({}, { message: "费用必须为数字" })
  cost: number;

  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  placedUserId: string;
}
