import { randomBytes } from "crypto";
import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";
import { CookieOptions, Response } from "express";
import { Session } from "./model/session";
import { User } from "../user/model/user";

const COOKIE_OPTIONS: CookieOptions = {
  maxAge: 365 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

@Service()
export class SessionService {
  private readonly repository: Repository<Session>;

  constructor(source: DataSource) {
    this.repository = source.getRepository(Session);
  }

  public async findSession(
    id: string,
    options?: { loadUser?: boolean }
  ): Promise<Session | null> {
    if (!id) {
      // https://github.com/typeorm/typeorm/issues/2500
      return null;
    }

    return this.repository.findOne({
      where: { id },
      relations: {
        user: !!options?.loadUser,
      },
    });
  }

  public async getAllSessions(user: User): Promise<Session[]> {
    return this.repository
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.user", "user")
      .where("user.id = :id", { id: user.id })
      .getMany();
  }

  public async startSession(user: User, res: Response): Promise<Session> {
    const session = new Session(randomBytes(32).toString("base64"), user);
    await this.repository.insert(session);
    res.cookie("token", session.id, COOKIE_OPTIONS);
    return session;
  }

  public async touch(session: Session, res: Response): Promise<void> {
    session.accessed = new Date();
    await this.repository.update(session.id, session);
    res.cookie("token", session.id, COOKIE_OPTIONS);
  }

  public async closeSession(session: Session, res: Response): Promise<void> {
    await this.repository.remove(session);
    res.removeHeader("Set-Cookie");
    res.clearCookie("token", COOKIE_OPTIONS);
  }
}
