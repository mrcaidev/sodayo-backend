import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @Length(8, 20)
  password: string;

  @IsOptional()
  @IsNumber()
  balance: number;

  @IsOptional()
  @IsNumber()
  credit: number;

  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsOptional()
  @IsString()
  nickName: string;

  @IsOptional()
  @IsString()
  realName: string;
}
