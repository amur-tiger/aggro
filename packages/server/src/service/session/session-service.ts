import { randomUUID } from "crypto";
import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";
import { Session } from "./model/session";
import { User } from "../user/model/user";

@Service()
export class SessionService {
  private readonly repository: Repository<Session>;

  constructor(source: DataSource) {
    this.repository = source.getRepository(Session);
  }

  public async findSession(id: string): Promise<Session | null> {
    return this.repository.findOneBy({ id });
  }

  public async getAllSessions(user: User): Promise<Session[]> {
    return this.repository
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.user", "user")
      .where("user.id = :id", { id: user.id })
      .getMany();
  }

  public async startSession(user: User): Promise<Session> {
    const session = new Session(randomUUID(), user);
    await this.repository.insert(session);
    return session;
  }

  public async closeSession(session: Session): Promise<void> {
    await this.repository.remove(session);
  }
}
