import { IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsPhoneNumber("CN", { message: "手机号格式错误" })
  phone: string;

  @Length(8, 20, { message: "密码必须在8-20个字符之间" })
  password: string;

  @IsString({ message: "确认密码必须为字符串" })
  passwordConfirmation: string;
}
