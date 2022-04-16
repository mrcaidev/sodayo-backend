import {
  DEFAULT_ORDER_STATUS,
  DEFAULT_ORDER_TYPE,
} from "orders/constants/default.constant";
import { OrderStatus } from "orders/constants/order-status.constant";
import { OrderType } from "orders/constants/order-type.constant";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "users/entities/user.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: DEFAULT_ORDER_TYPE })
  type: OrderType;

  @Column({ default: DEFAULT_ORDER_STATUS })
  status: OrderStatus;

  @Column()
  description: string;

  @Column()
  cost: number;

  @CreateDateColumn()
  placedTime: Date;

  @Column({ default: null, nullable: true })
  takenTime: Date;

  @Column({ default: null, nullable: true })
  finishedTime: Date;

  @JoinTable()
  @ManyToOne(() => User, user => user.placedOrders)
  placedUser: User;

  @JoinTable()
  @ManyToOne(() => User, user => user.takenOrders)
  takenUser: User;
}
