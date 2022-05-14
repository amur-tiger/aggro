import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  public constructor(
    id: string,
    username: string,
    mail: string,
    password: string,
    registered: Date
  ) {
    this.id = id;
    this.username = username;
    this.mail = mail;
    this.password = password;
    this.registered = registered;
  }

  @PrimaryColumn()
  public readonly id: string;

  @Column({ unique: true })
  public username: string;

  @Column({ unique: true })
  public mail: string;

  @Column()
  public password: string;

  @Column("timestamptz")
  public readonly registered: Date;
}
