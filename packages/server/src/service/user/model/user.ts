import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  constructor(id: string, username: string, mail: string, password: string) {
    this.id = id;
    this.username = username;
    this.mail = mail;
    this.password = password;
  }

  @PrimaryColumn()
  public readonly id: string;

  @Column({ unique: true })
  public username: string;

  @Column({ unique: true })
  public mail: string;

  @Column()
  public password: string;
}
