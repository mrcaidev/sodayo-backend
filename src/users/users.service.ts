import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
  ) {}

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户ID不存在: ${id}`);
    }
    return user;
  }

  async findOneByPhone(phone: string) {
    return this.userRepository.findOne({ phone });
  }

  async create(createUserDto: CreateUserDto) {
    const { phone, password } = createUserDto;

    // Ensure user does not exist.
    const user = await this.findOneByPhone(phone);
    if (user) {
      throw new ConflictException(`手机号已注册: ${phone}`);
    }

    // Encrypt password.
    const hashed = await encryptPassword(password);

    // Save user.
    this.userRepository.save({ phone, password: hashed });
    return {};
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
