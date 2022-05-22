import { Pool } from "pg";
import { Axios } from "axios";
import RssParser from "rss-parser";
import { Container } from "./core/container";

export async function initContainer(): Promise<Container> {
  const container = new Container();

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
  container.set(Axios, () => new Axios({}));
  container.set(RssParser, () => new RssParser());

  return container;
}
