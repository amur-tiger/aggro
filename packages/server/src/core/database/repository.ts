import { Pool } from "pg";
import { Service } from "../container";
import { Filter } from "./filter";
import { QueryBuilder } from "./query-builder";

@Service()
export abstract class Repository<T extends { id: string }> {
  protected abstract readonly tableName: string;

  public constructor(protected readonly client: Pool) {}

  private applyWhere(qb: QueryBuilder, filter: Filter<T>): void {
    const [key] = filter.orderBy;
    if (filter.userId != null) {
      qb.where("userid = :id", { id: filter.userId });
    }
    if (filter.beforeId != null) {
      qb.where(
        `${key} < (SELECT ${key} FROM "${this.tableName}" WHERE id = :id)`,
        { id: filter.beforeId }
      );
    }
    if (filter.afterId != null) {
      qb.where(
        `${key} > (SELECT ${key} FROM "${this.tableName}" WHERE id = :id)`,
        { id: filter.afterId }
      );
    }
  }

  public async count(filter?: Filter<T>): Promise<number> {
    if (!filter) {
      const response = await this.client.query(
        `SELECT COUNT(*)
         FROM "${this.tableName}"`
      );
      return response.rows[0].count;
    }

    const qb = new QueryBuilder();
    qb.select("COUNT(*)").from(this.tableName);
    this.applyWhere(qb, filter);

    const [query, parameters] = qb.build();
    const result = await this.client.query(query, parameters);
    return result.rows[0].count;
  }

  public async find(filter?: Filter<T>): Promise<T[]> {
    if (!filter) {
      const response = await this.client.query(`
          SELECT *
          FROM "${this.tableName}"`);
      return response.rows;
    }

    const [key, dir] = filter.orderBy;
    const qb = new QueryBuilder();
    qb.select("*").from(this.tableName);
    this.applyWhere(qb, filter);

    if (filter.lastLimit != null) {
      qb.limit(filter.lastLimit);
      qb.orderBy(key as string, dir === "ASC" ? "DESC" : "ASC");
    } else {
      if (filter.firstLimit != null) {
        qb.limit(filter.firstLimit);
      }
      qb.orderBy(key as string, dir);
    }

    let [query, parameters] = qb.build();

    if (filter.lastLimit != null) {
      query = `SELECT *
               FROM (${query}) q
               ORDER BY ${key} ${dir}`;
      if (filter.firstLimit != null) {
        parameters.push(filter.firstLimit);
        query += ` LIMIT $${parameters.length}`;
      }
    }

    const result = await this.client.query(query, parameters);
    return result.rows;
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
