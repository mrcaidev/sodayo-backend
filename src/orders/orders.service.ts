import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "users/entities/user.entity";
import { UsersService } from "users/users.service";
import { OrderStatus } from "./constants/order-status.constant";
import { CreateOrderWithIdDto } from "./dto/create-order.dto";
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
      where: await this.buildFindCondition(findOrderDto),
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

  async create(createOrderWithIdDto: CreateOrderWithIdDto) {
    const placedUser = await this.preloadUserById(
      createOrderWithIdDto.placedUserId,
    );
    const order = this.orderRepository.create({
      ...createOrderWithIdDto,
      placedUser,
    });
    await this.orderRepository.save(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { userId } = updateOrderDto;
    const order = await this.orderRepository.findOne(id);
    if (order.status === OrderStatus.placed) {
      await this.take(id, userId);
    } else if (order.status === OrderStatus.taken) {
      await this.finish(id);
    }
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
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  private async preloadUserById(id: string) {
    return this.usersService.findOneAsPublic(id);
  }

  private async buildFindCondition(findOrderDto: FindOrderDto) {
    const { type, status, placedUserId, takenUserId } = findOrderDto;
    const where: {
      type?: typeof type;
      status?: typeof status;
      placedUser?: User;
      takenUser?: User;
    } = {};
    if (type !== undefined) {
      where.type = type;
    }
    if (status !== undefined) {
      where.status = status;
    }
    if (placedUserId !== undefined) {
      where.placedUser = await this.preloadUserById(placedUserId);
    }
    if (takenUserId !== undefined) {
      where.takenUser = await this.preloadUserById(takenUserId);
    }
    return where;
  }
}
