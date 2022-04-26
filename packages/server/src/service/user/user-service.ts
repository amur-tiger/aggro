import { pbkdf2 as pbkdf2_cb, randomBytes, randomUUID } from "crypto";
import { promisify } from "util";
import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";
import { Logger } from "../logger";
import { User } from "./model/user";

const pbkdf2 = promisify(pbkdf2_cb);

@Service()
export class UserService {
  private readonly logger = new Logger(UserService);
  private readonly repository: Repository<User>;

  public readonly passwordIterations = 1000;
  public readonly passwordKeyLength = 64;
  public readonly passwordDigest = "sha256";

  public constructor(source: DataSource) {
    this.repository = source.getRepository(User);
  }

  public async initAdminAccountIfNecessary() {
    if (!process.env.AGGRO_USERNAME || !process.env.AGGRO_PASSWORD) {
      return;
    }

    const count = await this.repository.count();
    if (count > 0) {
      this.logger.debug(`There are ${count} registered users`);
      return;
    }

    const id = randomUUID();
    this.logger.info(
      `Creating initial admin user with id "${id}" and username "${process.env.AGGRO_USERNAME}"`
    );

    const admin = new User(
      id,
      process.env.AGGRO_USERNAME,
      "",
      await this.hashPassword(process.env.AGGRO_PASSWORD)
    );

    await this.repository.insert(admin);
  }

  public async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  public async findByMail(mail: string): Promise<User | null> {
    return this.repository.findOneBy({ mail });
  }

  public async isValidPassword(user: User, password: string): Promise<boolean> {
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
}
