import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber({}, { message: "状态必须为数字" })
  status: number;

  @IsOptional()
  @IsUUID(4, { message: "用户ID格式错误" })
  takenUserId: string;
}
