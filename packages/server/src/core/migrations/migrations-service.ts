import { Pool } from "pg";
import { Logger } from "../logger";
import { Container, Service } from "../container";
import { migrations } from "./steps";

@Service()
export class MigrationsService {
  private readonly logger = new Logger(MigrationsService);

  public constructor(private readonly client: Pool, private readonly container: Container) {}

  public async init() {
    this.logger.debug("Checking database schema status");
    await this.client.query(`CREATE TABLE IF NOT EXISTS aggro_metadata
                             (
                                 id   INT         NOT NULL PRIMARY KEY,
                                 name VARCHAR(16) NOT NULL,
                                 date TIMESTAMPTZ NOT NULL
                             )`);

    const savedMigrationsResponse = await this.client.query(`SELECT id, name
                                                             FROM aggro_metadata`);

    const sortedMigrations = [...migrations].sort((a, b) => a.id - b.id);
    for (const migration of sortedMigrations) {
      if (savedMigrationsResponse.rows.some((row) => row.id === migration.id)) {
        this.logger.debug(`Migration ${migration.id}: "${migration.name}" is already applied`);
        continue;
      }

      this.logger.info(`Applying migration ${migration.id}: "${migration.name}"`);
      await migration.up(this.client, this.container, this.logger);
      await this.client.query(
        `INSERT INTO aggro_metadata (id, name, date)
         VALUES ($1, $2, NOW())`,
        [migration.id, migration.name]
      );
    }
  }
}
