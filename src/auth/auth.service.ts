import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "users/entities/user.entity";
import { UsersService } from "users/users.service";
import { verifyPassword } from "utils/password";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    const { id } = user;
    return this.jwtService.signAsync({ id });
  }

  async getProfile(id: string) {
    return this.usersService.findOneAsPrivate(id);
  }

  async validateUser(phone: string, password: string) {
    // Find the user.
    const user = await this.usersService.findOneByPhone(phone);

    // Verify password.
    const { password: hashed, ...rest } = user;
    const verified = await verifyPassword(password, hashed);
    if (!verified) {
      throw new UnauthorizedException(`密码错误`);
    }

    return rest;
  }
}
