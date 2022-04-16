import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "users/entities/user.entity";
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
    return this.orderRepository.findAndCount({
      relations: ["placedUser", "takenUser"],
      skip: offset,
      take: limit,
      where: await this.buildFindCondition(findOrderDto),
      order: { placedTime: "DESC", takenTime: "DESC" },
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

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const placedUser = await this.preloadUserById(userId);
    if (!placedUser) {
      throw new NotFoundException(`用户不存在: ${userId}`);
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
      placedUser,
    });
    await this.orderRepository.save(order);
  }

  async enterNextStage(id: string, userId: string) {
    const order = await this.findOne(id);
    switch (order.status) {
      case OrderStatus.placed: {
        const takenUser = await this.preloadUserById(userId);
        await this.orderRepository.save({
          ...order,
          status: OrderStatus.taken,
          takenTime: new Date(),
          takenUser,
        });
        return;
      }
      case OrderStatus.taken: {
        await this.orderRepository.save({
          ...order,
          status: OrderStatus.finished,
          finishedTime: new Date(),
        });
        return;
      }

      default:
        return;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({ id, ...updateOrderDto });
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
