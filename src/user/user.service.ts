import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "users/users.service";
import { verifyPassword } from "utils/password";

/**
 * 当前用户服务层。
 */
@Injectable()
export class UserService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 获取当前用户私密资料。
   * @param id 当前用户 ID。
   * @returns 用户私密资料。
   */
  async getProfile(id: string) {
    return this.usersService.findOneAsPrivate(id);
  }

  /**
   * 登录验证并生成 JWT token。
   * @param phone 手机号。
   * @param password 密码。
   * @returns 为当前用户颁发的 JWT token。
   */
  async generateToken(phone: string, password: string) {
    // 找到手机号对应的用户。
    const user = await this.usersService.findOneByPhone(phone);

    // 验证密码。
    const { id, password: hashed } = user;
    const verified = await verifyPassword(password, hashed);
    if (!verified) {
      throw new UnauthorizedException(`密码错误`);
    }

    // 为该用户颁发 JWT token。
    return this.jwtService.signAsync({ id });
  }
}
