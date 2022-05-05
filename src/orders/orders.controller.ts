import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "auth/guards/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FindOrderDto } from "./dto/find-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersService } from "./orders.service";

/**
 * 订单控制层。
 */
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 获取订单列表。
   * @param findOrderDto 查询订单的 DTO。
   * @returns 符合要求的订单列表。
   */
  @Get()
  findAll(@Query() findOrderDto: FindOrderDto) {
    return this.ordersService.findAll(findOrderDto);
  }

  /**
   * 凭 ID 获取订单信息。
   * @param id 订单 ID。
   * @returns 订单信息。
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  /**
   * 创建订单。访问者视为下单用户。
   * @param req 包含访问者 ID。
   * @param createOrderDto 创建订单的 DTO。
   * @returns 创建的订单信息。
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const visitorId: string = req.user.id;
    return this.ordersService.create(createOrderDto, visitorId);
  }

  /**
   * 步进订单状态。访问者视为更新者。
   * @param req 包含访问者 ID。
   * @param id 要步进状态的订单 ID。
   * @returns 步进后的订单信息。
   */
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  enterNextState(@Req() req, @Param("id") id: string) {
    const userId = req.user.id as string;
    return this.ordersService.enterNextStage(id, userId);
  }

  /**
   * 更新订单。访问者视为更新者。
   * @param id 要更新的订单 ID。
   * @param updateOrderDto 更新订单的 DTO。
   * @returns 更新后的订单信息。
   */
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  /**
   * 删除订单。访问者视为删除者。
   * @param id 要删除的订单 ID。
   * @returns 删除的订单信息。
   */
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }
}
