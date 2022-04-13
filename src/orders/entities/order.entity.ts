import {
  DEFAULT_ORDER_STATUS,
  DEFAULT_ORDER_TYPE,
} from "orders/constants/default.constant";
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
  type: number;

  @Column({ default: DEFAULT_ORDER_STATUS })
  status: number;

  @Column()
  description: string;

  @Column({ nullable: true })
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
