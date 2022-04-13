import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "users/users.service";
import { OrderStatus } from "./constants/order-status.constant";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FindOrderDto } from "./dto/find-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(findOrderDto: FindOrderDto) {
    const { limit, offset } = findOrderDto;
    return this.orderRepository.find({
      relations: ["placedUser", "takenUser"],
      skip: offset,
      take: limit,
      where: this.buildFindCondition(findOrderDto),
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne(id, {
      relations: ["placedUser", "takenUser"],
    });
    if (!order) {
      throw new NotFoundException(`订单不存在: ${id}`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const placedUser = await this.preloadUserById(createOrderDto.placedUserId);
    const order = this.orderRepository.create({
      ...createOrderDto,
      placedUser,
    });
    return this.orderRepository.save(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { status, takenUserId } = updateOrderDto;
    if (status === OrderStatus.taken) {
      return this.take(id, takenUserId);
    } else if (status === OrderStatus.finished) {
      return this.finish(id);
    }
    return {};
  }

  async take(id: string, takenUserId: string) {
    const takenUser = await this.preloadUserById(takenUserId);
    const order = await this.orderRepository.preload({
      id,
      status: OrderStatus.taken,
      takenTime: new Date(),
      takenUser,
    });
    if (!order) {
      throw new NotFoundException(`订单不存在: ${id}`);
    }
    await this.orderRepository.save(order);
    return {};
  }

  async finish(id: string) {
    const order = await this.orderRepository.preload({
      id,
      status: OrderStatus.finished,
      finishedTime: new Date(),
    });
    if (!order) {
      throw new NotFoundException(`订单不存在: ${id}`);
    }
    await this.orderRepository.save(order);
    return {};
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return {};
  }

  private async preloadUserById(id: string) {
    return this.usersService.findOneAsPublic(id);
  }

  private buildFindCondition(findOrderDto: FindOrderDto) {
    const { type, status } = findOrderDto;
    const where: { type?: typeof type; status?: typeof status } = {};
    if (type !== undefined) {
      where.type = type;
    }
    if (status !== undefined) {
      where.status = status;
    }
    return where;
  }
}
