import { randomBytes, randomUUID } from "crypto";
import { CookieOptions, Response } from "express";
import { Logger } from "../../../core/logger";
import { Service } from "../../../core/container";
import { UserEntity } from "../../user";
import { SessionRepository } from "../repository/session-repository";
import { SessionEntity } from "../repository/model/session-entity";

const ALPHA_NUMERIC =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const COOKIE_OPTIONS: CookieOptions = {
  maxAge: 365 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: !IS_DEVELOPMENT,
  sameSite: "lax",
};

@Service()
export class SessionService {
  private readonly logger = new Logger(SessionService);

  public constructor(private readonly repository: SessionRepository) {
    if (IS_DEVELOPMENT) {
      this.logger.warn(
        "Allowing session cookies over insecure channels (devmode)"
      );
    }
  }

  private createToken(): string {
    const buffer = randomBytes(32);
    let token = "";
    for (let i = 0; i < 32; i++) {
      const r = buffer.readUint8(i) % ALPHA_NUMERIC.length;
      token += ALPHA_NUMERIC[r];
    }
    return token;
  }

  public async findSession(token: string): Promise<SessionEntity | null> {
    return this.repository.findOneBy("token", token);
  }

  public async startSession(
    user: UserEntity,
    res: Response
  ): Promise<SessionEntity> {
    const session: SessionEntity = {
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

  public async touch(session: SessionEntity, res: Response): Promise<void> {
    session.accessed = new Date();
    await this.repository.update(session);
    res.cookie("token", session.token, COOKIE_OPTIONS);
  }

  public async closeSession(
    session: SessionEntity,
    res: Response
  ): Promise<void> {
    await this.repository.delete(session);
    res.removeHeader("Set-Cookie");
    res.clearCookie("token", COOKIE_OPTIONS);
  }
}
