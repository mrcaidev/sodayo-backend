import { Injectable } from "@nestjs/common";
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

  async validateUser(phone: string, password: string) {
    // Find the user.
    const user = await this.usersService.findOneByPhone(phone);
    if (!user) {
      return null;
    }

    // Verify password.
    const { password: hashed, ...rest } = user;
    const verified = await verifyPassword(password, hashed);
    if (!verified) {
      return null;
    }

    return rest;
  }

  async login(user: User) {
    const payload = { id: user.id };
    return this.jwtService.signAsync(payload);
  }
}
