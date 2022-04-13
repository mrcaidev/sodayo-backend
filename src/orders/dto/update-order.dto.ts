import { IsNumber, IsOptional, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber({}, { message: "状态必须为数字" })
  status: number;

  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  takenUserId: string;
}
