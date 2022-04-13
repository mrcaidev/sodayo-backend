import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { encryptPassword } from "utils/password";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOneByPhone(phone: string) {
    const user = await this.userRepository.findOne({ phone });
    if (!user) {
      throw new NotFoundException(`手机号不存在: ${phone}`);
    }
    return user;
  }

  async findOneAsPrivate(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户ID不存在: ${id}`);
    }
    delete user.password;
    return user;
  }

  async findOneAsPublic(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户ID不存在`);
    }
    delete user.password;
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { phone, password } = createUserDto;

    // Ensure user does not exist.
    const user = await this.userRepository.findOne({ phone });
    if (user) {
      throw new ConflictException(`手机号已注册: ${phone}`);
    }

    // Encrypt password.
    const hashed = await encryptPassword(password);

    // Save user.
    const { id } = await this.userRepository.save({ phone, password: hashed });

    // Create JWT token.
    return this.jwtService.signAsync({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`用户ID不存在: ${id}`);
    }
    this.userRepository.save(user);
    return {};
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户ID不存在: ${id}`);
    }
    this.userRepository.remove(user);
    return {};
  }
}
