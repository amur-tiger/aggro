import { randomBytes, randomUUID } from "crypto";
import { CookieOptions, Response } from "express";
import { Session } from "../repository/model/session";
import { User } from "../../user/repository/model/user";
import { SessionRepository } from "../repository/session-repository";
import { Service } from "../../../core/container/decorators/service";

const ALPHA_NUMERIC =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const COOKIE_OPTIONS: CookieOptions = {
  maxAge: 365 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

@Service()
export class SessionService {
  public constructor(private readonly repository: SessionRepository) {}

  private createToken(): string {
    const buffer = randomBytes(32);
    let token = "";
    for (let i = 0; i < 32; i++) {
      const r = buffer.readUint8(i) % ALPHA_NUMERIC.length;
      token += ALPHA_NUMERIC[r];
    }
    return token;
  }

  public async findSession(token: string): Promise<Session | null> {
    return this.repository.findOneBy("token", token);
  }

  public async startSession(user: User, res: Response): Promise<Session> {
    const session: Session = {
      id: randomUUID(),
      userid: user.id,
      token: this.createToken(),
      created: new Date(),
      accessed: new Date(),
    };
    await this.repository.insert(session);
    res.cookie("token", session.token, COOKIE_OPTIONS);
    return session;
  }

  public async touch(session: Session, res: Response): Promise<void> {
    session.accessed = new Date();
    await this.repository.update(session);
    res.cookie("token", session.token, COOKIE_OPTIONS);
  }

  public async closeSession(session: Session, res: Response): Promise<void> {
    await this.repository.delete(session);
    res.removeHeader("Set-Cookie");
    res.clearCookie("token", COOKIE_OPTIONS);
  }
}
