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

/**
 * 更新用户信息的 DTO。
 */
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ["password"]),
) {
  /** 钱包余额。 */
  @IsOptional()
  @Min(0, { message: "余额不能少于0" })
  @Max(100000, { message: "余额不能大于100000" })
  @IsNumber({}, { message: "余额必须为数字" })
  balance: number;

  /** 信誉值。 */
  @IsOptional()
  @Min(0, { message: "信誉不能低于0" })
  @Max(5, { message: "信誉不能高于5" })
  @IsNumber({}, { message: "信誉必须为数字" })
  credit: number;

  /** 角色。 */
  @IsOptional()
  @IsEnum(Role, { message: "角色错误" })
  role: Role;

  /** 头像 URL。 */
  @IsOptional()
  @IsUrl({ message: "URL格式错误" })
  avatarUrl: string;

  /** 昵称。 */
  @IsOptional()
  @IsString({ message: "昵称必须为字符串" })
  nickName: string;

  /** 实名。 */
  @IsOptional()
  @IsString({ message: "姓名必须为字符串" })
  realName: string;
}
