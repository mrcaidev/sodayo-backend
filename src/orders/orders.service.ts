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

/**
 * 订单服务层。
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 获取订单列表。
   * @param findOrderDto 查询订单的 DTO。
   * @returns 符合要求的订单列表。
   */
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

  /**
   * 凭订单 ID 获取订单信息。
   * @param id 订单 ID。
   * @returns 订单信息。
   */
  async findOne(id: string) {
    const order = await this.orderRepository.findOne(id, {
      relations: ["placedUser", "takenUser"],
    });
    if (!order) {
      throw new NotFoundException(`订单不存在: ${id}`);
    }
    return order;
  }

  /**
   * 创建订单。
   * @param createOrderDto 创建订单的 DTO。
   * @param userId 下单用户的 ID。
   * @returns 创建的订单信息。
   */
  async create(createOrderDto: CreateOrderDto, userId: string) {
    // 找到下单用户。
    const placedUser = await this.preloadUserById(userId);
    if (!placedUser) {
      throw new NotFoundException(`用户不存在: ${userId}`);
    }

    // 创建订单。
    const order = this.orderRepository.create({
      ...createOrderDto,
      placedUser,
    });
    return this.orderRepository.save(order);
  }

  /**
   * 步进订单状态。
   * @param id 要步进状态的订单 ID。
   * @param userId 步进订单者 ID。
   * @returns 步进后的订单信息。
   */
  async enterNextStage(id: string, userId: string) {
    // 找到该订单。
    const order = await this.findOne(id);

    switch (order.status) {
      // 如果订单在待接单状态。
      case OrderStatus.placed: {
        const takenUser = await this.preloadUserById(userId);
        const newOrder: Order = {
          ...order,
          status: OrderStatus.taken,
          takenTime: new Date(),
          takenUser,
        };
        return this.orderRepository.save(newOrder);
      }

      // 如果订单在已接单状态。
      case OrderStatus.taken: {
        const newOrder: Order = {
          ...order,
          status: OrderStatus.finished,
          finishedTime: new Date(),
        };
        return this.orderRepository.save(newOrder);
      }

      // 如果在其它状态。
      default:
        return order;
    }
  }

  /**
   * 更新订单。
   * @param id 要更新的订单的 ID。
   * @param updateOrderDto 更新订单的 DTO。
   * @returns 更新后的订单信息。
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({ id, ...updateOrderDto });
    if (!order) {
      throw new NotFoundException(`订单不存在: ${id}`);
    }
    return this.orderRepository.save(order);
  }

  /**
   * 删除订单。
   * @param id 要删除的订单 ID。
   * @returns 删除的订单信息。
   */
  async remove(id: string) {
    const order = await this.findOne(id);
    return this.orderRepository.remove(order);
  }

  /**
   * 凭 ID 获取用户公开信息。
   * @param id 用户 ID。
   * @returns 用户公开信息。
   */
  private async preloadUserById(id: string) {
    return this.usersService.findOneAsPublic(id);
  }

  /**
   * 构建用于 ORM 查询的条件。
   * @param findOrderDto 查询订单的 DTO。
   * @returns 构建出的查询条件。
   */
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
