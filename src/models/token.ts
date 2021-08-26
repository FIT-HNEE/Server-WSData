import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { User } from "./user";

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @Column()
  tokenId!: number;
  @ManyToOne(() => User, user => user.refreshTokens)
  @JoinColumn({ name: "tokenId" })
  tokens!: User;  
}