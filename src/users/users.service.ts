import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { encryptPassword } from "utils/password";
import { Role } from "./constants/role.constant";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

/**
 * 用户服务层。
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 凭 ID 获取用户完整信息。
   * @param id 用户 ID。
   * @returns 用户完整信息。
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户ID不存在: ${id}`);
    }
    return user;
  }

  /**
   * 凭手机号获取用户完整信息。
   * @param phone 用户手机号。
   * @returns 用户完整信息。
   */
  async findOneByPhone(phone: string) {
    const user = await this.userRepository.findOne({ phone });
    if (!user) {
      throw new NotFoundException(`手机号不存在: ${phone}`);
    }
    return user;
  }

  /**
   * 凭 ID 获取用户私密信息。
   * @param id 用户 ID。
   * @returns 用户私密信息。
   */
  async findOneAsPrivate(id: string) {
    const user = await this.findOne(id);

    // 隐藏用户密码。
    delete user.password;

    return user;
  }

  /**
   * 凭 ID 获取用户公开信息。
   * @param id 用户 ID。
   * @returns 用户公开信息。
   */
  async findOneAsPublic(id: string) {
    const user = await this.findOne(id);
    switch (user.role) {
      // 顾客角色需要隐藏余额、密码、手机号、实名。
      case Role.customer:
        delete user.balance;
        delete user.password;
        delete user.phone;
        delete user.realName;
        break;

      // 其他角色需要隐藏余额、密码。
      default:
        delete user.balance;
        delete user.password;
        break;
    }
    return user;
  }

  /**
   * 创建用户。
   * @param createUserDto 创建用户 DTO。
   * @returns 为该用户颁发的 JWT token。
   */
  async create(createUserDto: CreateUserDto) {
    const { phone, password } = createUserDto;

    // 确保手机号未被注册。
    const user = await this.userRepository.findOne({ phone });
    if (user) {
      throw new ConflictException(`手机号已注册: ${phone}`);
    }

    // 加密密码。
    const hashed = await encryptPassword(password);

    // 存进数据库。
    const { id } = await this.userRepository.save({ phone, password: hashed });

    // 颁发 JWT token。
    return this.jwtService.signAsync({ id });
  }

  /**
   * 更新用户。
   * @param id 要更新的用户的 ID。
   * @param updateUserDto 更新用户的 DTO。
   * @returns 更新后的用户信息。
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`用户ID不存在: ${id}`);
    }
    return this.userRepository.save(user);
  }

  /**
   * 删除用户。
   * @param id 要删除的用户的 ID。
   * @returns 删除的用户信息。
   */
  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
