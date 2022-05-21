import { Repository } from "../../../core/database/repository";
import { Session } from "./model/session";
import { Service } from "../../../core/container/decorators/service";

@Service()
export class SessionRepository extends Repository<Session> {
  protected readonly tableName = "session";

  public async insert(session: Session): Promise<void> {
    await this.client.query(
      `INSERT INTO session (id, userId, token, created, accessed)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        session.id,
        session.userid,
        session.token,
        session.created,
        session.accessed,
      ]
    );
  }

  public async update(session: Session): Promise<void> {
    await this.client.query(
      `UPDATE session
       SET accessed = $1
       WHERE id = $2`,
      [session.accessed, session.id]
    );
  }
}
