import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "auth/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

/**
 * 用户控制层。
 */
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 凭借 ID 获取用户公开信息。
   * @param id 用户 ID。
   * @returns 用户公开信息。
   */
  @Get(":id")
  async findOneAsPublic(@Param("id") id: string) {
    return this.usersService.findOneAsPublic(id);
  }

  /**
   * 创建用户。
   * @param createUserDto 创建用户的 DTO。
   * @returns 为该用户颁发的 JWT token。
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * 更新用户。只允许其本人访问。
   * @param req 包含请求端用户 ID。
   * @param id 要更新的用户 ID。
   * @param updateUserDto 更新用户的 DTO。
   * @returns 更新后的用户信息。
   */
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const visitorId: string = req.user.id;
    if (visitorId !== id) {
      throw new ForbiddenException("无权更新");
    }
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * 删除用户。只允许其本人访问。
   * @param req 包含请求端用户 ID。
   * @param id 要删除的用户 ID。
   * @returns 删除的用户信息。
   */
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Req() req, @Param("id") id: string) {
    const visitorId: string = req.user.id;
    if (visitorId !== id) {
      throw new ForbiddenException("无权删除");
    }
    return this.usersService.remove(id);
  }
}
