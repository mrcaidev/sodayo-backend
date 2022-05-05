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

/**
 * 订单数据模型。
 */
@Entity("orders")
export class Order {
  /** 唯一标识 UUID。 */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** 类型。 */
  @Column({ default: DEFAULT_ORDER_TYPE })
  type: OrderType;

  /** 状态。 */
  @Column({ default: DEFAULT_ORDER_STATUS })
  status: OrderStatus;

  /** 描述。 */
  @Column()
  description: string;

  /** 费用。 */
  @Column()
  cost: number;

  /** 下单时间。 */
  @CreateDateColumn()
  placedTime: Date;

  /** 接单时间。 */
  @Column({ default: null, nullable: true })
  takenTime: Date;

  /** 完成时间。 */
  @Column({ default: null, nullable: true })
  finishedTime: Date;

  /** 下单用户。 */
  @JoinTable()
  @ManyToOne(() => User, user => user.placedOrders)
  placedUser: User;

  /** 接单用户。 */
  @JoinTable()
  @ManyToOne(() => User, user => user.takenOrders)
  takenUser: User;
}
