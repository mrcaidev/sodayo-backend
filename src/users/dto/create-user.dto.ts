import { IsPhoneNumber, Length } from "class-validator";

/**
 * 创建用户的 DTO。
 */
export class CreateUserDto {
  /** 用户的手机号码。 */
  @IsPhoneNumber("CN", { message: "手机号格式错误" })
  phone: string;

  /** 用户设定的密码。（8-20位） */
  @Length(8, 20, { message: "密码必须在8-20个字符之间" })
  password: string;
}
