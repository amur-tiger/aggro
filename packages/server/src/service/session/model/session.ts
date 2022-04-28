import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../../user/model/user";

@Entity()
export class Session {
  constructor(id: string, user: User) {
    this.id = id;
    this.user = user;
    this.created = new Date();
    this.accessed = new Date();
  }

  @PrimaryColumn()
  public readonly id: string;

  @ManyToOne(() => User, {
    nullable: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  public readonly user: User;

  @Column()
  public readonly created: Date;

  @Column()
  public accessed: Date;
}
