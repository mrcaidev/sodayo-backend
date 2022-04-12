import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 3 })
  credit: number;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  nickName: string;

  @Column({ nullable: true })
  realName: string;
}
