import { Repository } from "../../../core/database/repository";
import { User } from "./model/user";
import { Service } from "../../../core/container/decorators/service";

@Service()
export class UserRepository extends Repository<User> {
  protected readonly tableName = "user";

  public async insert(user: User): Promise<void> {
    await this.client.query(
      `INSERT INTO "user" (id, username, mail, password, registered, lastlogin)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        user.id,
        user.username,
        user.mail,
        user.password,
        user.registered,
        user.lastlogin,
      ]
    );
  }

  public async update(user: User): Promise<void> {
    await this.client.query(
      `UPDATE "user"
       SET username  = $1,
           mail      = $2,
           password  = $3,
           lastlogin = $4
       WHERE id = $5`,
      [user.username, user.mail, user.password, user.lastlogin, user.id]
    );
  }
}
