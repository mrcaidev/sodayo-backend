import { IsOptional, IsUUID } from "class-validator";
import { DEFAULT_UUID_VERSION } from "common/constants/default.constant";

export class UpdateOrderDto {
  @IsOptional()
  @IsUUID(DEFAULT_UUID_VERSION, { message: "用户ID格式错误" })
  userId: string;
}
