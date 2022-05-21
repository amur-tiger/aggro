import { Pool } from "pg";
import { Service } from "../container/decorators/service";

@Service()
export abstract class Repository<T extends { id: string }> {
  protected abstract readonly tableName: string;

  public constructor(protected readonly client: Pool) {}

  public async count(): Promise<number> {
    const response = await this.client.query(
      `SELECT COUNT(*)
       FROM "${this.tableName}"`
    );
    return response.rows[0].count;
  }

  public async find(spec?: unknown): Promise<T[]> {
    if (!spec) {
      const response = await this.client.query(
        `SELECT *
         FROM "${this.tableName}"`
      );
      return response.rows;
    }

    throw new Error("not implemented");
  }

  public async findBy<K extends keyof T>(key: K, value: T[K]): Promise<T[]> {
    const response = await this.client.query(
      `SELECT *
       FROM "${this.tableName}"
       WHERE ${key} = $1`,
      [value]
    );
    return response.rows;
  }

  public async findOneBy<K extends keyof T>(
    key: K,
    value: T[K]
  ): Promise<T | null> {
    const response = await this.client.query(
      `SELECT *
       FROM "${this.tableName}"
       WHERE ${key} = $1
       LIMIT 1`,
      [value]
    );
    return response.rows[0] ?? null;
  }

  public abstract insert(entity: T): Promise<void>;

  public abstract update(entity: T): Promise<void>;

  public async delete(entity: T): Promise<void> {
    return this.deleteById(entity.id);
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.query(
      `DELETE
       FROM "${this.tableName}"
       WHERE id = $1`,
      [id]
    );
  }
}
