import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
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
    const { password, ...rest } = await this.usersService.findOne(id);
    return rest;
  }

  async validateUser(phone: string, password: string) {
    // Find the user.
    const user = await this.usersService.findOneByPhone(phone);
    if (!user) {
      throw new NotFoundException(`用户不存在: ${phone}`);
    }

    // Verify password.
    const { password: hashed, ...rest } = user;
    const verified = await verifyPassword(password, hashed);
    if (!verified) {
      throw new UnauthorizedException(`密码错误`);
    }

    return rest;
  }
}
