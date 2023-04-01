import { pbkdf2 as pbkdf2_cb, randomBytes, randomUUID } from "crypto";
import { promisify } from "util";
import { Logger } from "../../../core/logger";
import { Service } from "../../../core/container";
import { UserRepository } from "../repository/user-repository";
import { UserEntity } from "../repository/model/user-entity";

const pbkdf2 = promisify(pbkdf2_cb);

@Service()
export class UserService {
  private readonly logger = new Logger(UserService);

  public readonly passwordIterations = 1000;
  public readonly passwordKeyLength = 64;
  public readonly passwordDigest = "sha256";

  public constructor(private readonly repository: UserRepository) {}

  public async initAdminAccountIfNecessary() {
    if (!process.env.AGGRO_MAIL || !process.env.AGGRO_PASSWORD) {
      return;
    }

    const count = await this.repository.count();
    if (count > 0) {
      this.logger.debug(`There are ${count} registered users`);
      return;
    }

    const id = randomUUID();
    this.logger.info(
      `Creating initial admin user with id "${id}" and mail "${process.env.AGGRO_MAIL}"`
    );

    await this.repository.insert({
      id,
      username: process.env.AGGRO_USERNAME ?? "admin",
      mail: process.env.AGGRO_MAIL,
      password: await this.hashPassword(process.env.AGGRO_PASSWORD),
      registered: new Date(),
      lastlogin: null,
    });
  }

  public async isValidPassword(user: UserEntity, password: string): Promise<boolean> {
    const [, func, args, salt, hash] = user.password.split("$");
    if (func !== "pbkdf2") {
      throw new Error(`Cannot verify "${func}" hash.`);
    }

    const [iterations, keyLength, digest] = args.split(";");
    const buffer = await pbkdf2(
      password,
      salt,
      +iterations,
      +keyLength,
      digest
    );

    return hash === buffer.toString("hex");
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const hash = await pbkdf2(
      password,
      salt,
      this.passwordIterations,
      this.passwordKeyLength,
      this.passwordDigest
    );

    return `$pbkdf2$${this.passwordIterations};${this.passwordKeyLength};${
      this.passwordDigest
    }$${salt}$${hash.toString("hex")}`;
  }

  public async tryLogin(mail: string, password: string): Promise<UserEntity | null> {
    const user = await this.repository.findOneBy("mail", mail);
    if (!user) {
      return null;
    }

    const isValid = await this.isValidPassword(user, password);
    if (!isValid) {
      return null;
    }

    user.lastlogin = new Date();
    await this.repository.update(user);

    return user;
  }
}
