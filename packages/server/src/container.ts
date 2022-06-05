import { Pool } from "pg";
import { Container } from "./core/container";
import { FeedHandler } from "./domains/source";
import pkg from "../../../package.json";

export async function initContainer(): Promise<Container> {
  const container = new Container();

  container.setInstance("version", pkg.version);
  container.setInstance("port", 3000);
  container.set(
    Pool,
    () =>
      new Pool({
        host: process.env.AGGRO_DB_HOST ?? "localhost",
        port: +(process.env.AGGRO_DB_PORT ?? "5432"),
        database: process.env.AGGRO_DB_NAME ?? "aggro",
        user: process.env.AGGRO_DB_USER ?? "aggro",
        password: process.env.AGGRO_DB_PASSWORD ?? "aggropass",
      })
  );
  container.set("source-handlers", (c) => [c.get(FeedHandler)]);

  return container;
}
