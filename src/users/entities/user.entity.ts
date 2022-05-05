import { Order } from "orders/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {
  DEFAULT_BALANCE,
  DEFAULT_CREDIT,
  DEFAULT_ROLE,
} from "users/constants/default.constant";

/**
 * 用户数据模型。
 */
@Entity("users")
export class User {
  /** 唯一标识 UUID。 */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** 手机号码，即帐号。 */
  @Column({ update: false, unique: true })
  phone: string;

  /** 单向加密处理后的密码。 */
  @Column()
  password: string;

  /** 钱包余额。 */
  @Column({ default: DEFAULT_BALANCE })
  balance: number;

  /** 信誉值。 */
  @Column({ default: DEFAULT_CREDIT })
  credit: number;

  /** 角色。 */
  @Column({ default: DEFAULT_ROLE })
  role: number;

  /** 头像 URL。 */
  @Column({ nullable: true })
  avatarUrl: string;

  /** 昵称。 */
  @Column({ nullable: true })
  nickName: string;

  /** 实名。 */
  @Column({ nullable: true })
  realName: string;

  /** 下单列表。 */
  @OneToMany(() => Order, order => order.placedUser)
  placedOrders: Order[];

  /** 接单列表。 */
  @OneToMany(() => Order, order => order.takenUser)
  takenOrders: Order[];
}
