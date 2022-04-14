import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "auth/guards/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FindOrderDto } from "./dto/find-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() findOrderDto: FindOrderDto) {
    return this.ordersService.findAll(findOrderDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const placedUserId = req.user.id as string;
    return this.ordersService.create({ ...createOrderDto, placedUserId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Req() req, @Param("id") id: string) {
    const userId = req.user.id as string;
    return this.ordersService.update(id, { userId });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }
}
