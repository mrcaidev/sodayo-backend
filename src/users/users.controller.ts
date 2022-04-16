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

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  async findOneAsPublic(@Param("id") id: string) {
    return this.usersService.findOneAsPublic(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const curUserId = req.user.id;
    if (curUserId !== id) {
      throw new ForbiddenException("无权更新");
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Req() req, @Param("id") id: string) {
    const curUserId = req.user.id;
    if (curUserId !== id) {
      throw new ForbiddenException("无权删除");
    }
    return this.usersService.remove(id);
  }
}
