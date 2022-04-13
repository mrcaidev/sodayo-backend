import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {
  DEFAULT_BALANCE,
  DEFAULT_CREDIT,
  DEFAULT_ROLE,
} from "users/constants/default.constant";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ update: false, unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ default: DEFAULT_BALANCE })
  balance: number;

  @Column({ default: DEFAULT_CREDIT })
  credit: number;

  @Column({ default: DEFAULT_ROLE })
  role: number;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ nullable: true })
  realName: string;
}
