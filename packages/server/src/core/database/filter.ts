import { User } from "../../domains/user/repository/model/user";
import { Cursor } from "../api/pagination/cursor";
import { PaginationArgs } from "../api/pagination/pagination-args";

export class Filter<T> {
  public readonly orderBy: [keyof T, "ASC" | "DESC"];

  public userId?: string;
  public beforeId?: string;
  public afterId?: string;
  public firstLimit?: number;
  public lastLimit?: number;

  public constructor(orderBy: keyof T, direction: "ASC" | "DESC" = "ASC") {
    this.orderBy = [orderBy, direction];
  }

  public user(user: User | string): this {
    this.userId = typeof user === "string" ? user : user.id;
    return this;
  }

  public fromPagination(args: PaginationArgs): this {
    this.beforeId = args.before?.id ?? undefined;
    this.afterId = args.after?.id ?? undefined;
    this.firstLimit = args.first;
    this.lastLimit = args.last;
    return this;
  }

  public before(cursor?: Cursor | string): this {
    this.beforeId =
      typeof cursor === "string" ? cursor : cursor?.id ?? undefined;
    return this;
  }

  public after(cursor?: Cursor | string): this {
    this.afterId =
      typeof cursor === "string" ? cursor : cursor?.id ?? undefined;
    return this;
  }

  public first(limit?: number): this {
    this.firstLimit = limit;
    return this;
  }

  public last(limit?: number): this {
    this.lastLimit = limit;
    return this;
  }
}
