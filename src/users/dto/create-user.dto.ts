import { IsPhoneNumber, Length } from "class-validator";

export class CreateUserDto {
  @IsPhoneNumber("CN")
  phone: string;

  @Length(8, 20)
  password: string;
}
