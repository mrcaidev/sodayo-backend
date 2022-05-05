import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "user/user.service";

/**
 * 本地验证策略。
 *
 * 验证帐号与密码是否正确，并返回新的 token。
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: "phone" });
  }

  async validate(phone: string, password: string) {
    const token = await this.userService.generateToken(phone, password);
    return { token };
  }
}
