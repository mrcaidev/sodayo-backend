import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "auth/guards/local-auth.guard";
import { UserService } from "./user.service";

/**
 * 当前用户控制层。
 */
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前用户私密信息。只允许当前登录用户访问。
   * @param req 包含当前用户 ID。
   * @returns 当前用户私密信息。
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req: any) {
    const id = req.user.id;
    return this.userService.getProfile(id);
  }

  /**
   * 凭帐号密码登录，并为用户颁发 token。
   * @param req 包含为当前用户颁发的 token。
   * @returns 为当前用户颁发的 token。
   */
  @UseGuards(LocalAuthGuard)
  @Post("token")
  @HttpCode(200)
  async getToken(@Req() req: any) {
    return req.user.token;
  }
}
