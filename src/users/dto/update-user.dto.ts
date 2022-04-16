import { PartialType, PickType } from "@nestjs/mapped-types";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from "class-validator";
import { Role } from "users/constants/role.constant";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ["password"]),
) {
  @IsOptional()
  @Min(0, { message: "余额不能少于0" })
  @Max(100000, { message: "余额不能大于100000" })
  @IsNumber({}, { message: "余额必须为数字" })
  balance: number;

  @IsOptional()
  @Min(0, { message: "信誉不能低于0" })
  @Max(5, { message: "信誉不能高于5" })
  @IsNumber({}, { message: "信誉必须为数字" })
  credit: number;

  @IsOptional()
  @IsEnum(Role, { message: "角色错误" })
  role: Role;

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
