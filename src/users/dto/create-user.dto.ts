import { IsPhoneNumber, Length } from "class-validator";

export class CreateUserDto {
  @IsPhoneNumber("CN", { message: "手机号格式错误" })
  phone: string;

  @Length(8, 20, { message: "密码必须在8-20个字符之间" })
  password: string;
}
