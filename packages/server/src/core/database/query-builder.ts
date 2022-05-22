export class QueryBuilder {
  private fSelect: string = "*";
  private fFrom: string | null = null;
  private fWhere: string[] = [];
  private fOrderCol: string | null = null;
  private fDirection: "ASC" | "DESC" = "ASC";
  private fLimit: number | null = null;

  private fParams: unknown[] = [];

  public select(select: string): this {
    this.fSelect = select;
    return this;
  }

  public from(from: string): this {
    this.fFrom = from;
    return this;
  }

  public where(where: string, args?: Record<string, unknown>): this {
    if (args != null) {
      where = where.replaceAll(/:(\w+)/g, (_, key) => {
        this.fParams.push(args[key]);
        return `$${this.fParams.length}`;
      });
    }

    this.fWhere.push(where);
    return this;
  }

  public orderBy(column: string, dir?: "ASC" | "DESC"): this {
    this.fOrderCol = column;
    this.fDirection = dir ?? "ASC";
    return this;
  }

  public limit(limit: number): this {
    this.fLimit = limit;
    return this;
  }

  public build(): [string, unknown[]] {
    const params = [...this.fParams];

    if (this.fFrom == null) {
      throw new Error("Source table not set.");
    }

    let query = `SELECT ${this.fSelect}
                 FROM "${this.fFrom}"`;

    if (this.fWhere.length > 0) {
      query += ` WHERE ${this.fWhere.join(" AND ")}`;
    }

    if (this.fOrderCol != null) {
      query += ` ORDER BY ${this.fOrderCol} ${this.fDirection}`;
    }

    if (this.fLimit != null) {
      params.push(this.fLimit);
      query += ` LIMIT $${params.length}`;
    }

    return [query, params];
  }
}
