import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "./create-order.dto";

/**
 * 更新订单的 DTO。
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
