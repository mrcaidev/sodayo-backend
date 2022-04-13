import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ["password"]),
) {
  @IsOptional()
  @IsNumber({}, { message: "余额必须为数字" })
  balance: number;

  @IsOptional()
  @IsNumber({}, { message: "信誉必须为数字" })
  credit: number;

  @IsOptional()
  @IsNumber({}, { message: "角色必须为数字" })
  role: number;

  @IsOptional()
  @IsUrl({ message: "URL格式错误" })
  avatarUrl: string;

  @IsOptional()
  @IsString({ message: "昵称必须为字符串" })
  nickName: string;

  @IsOptional()
  @IsString({ message: "姓名必须为字符串" })
  realName: string;
}
