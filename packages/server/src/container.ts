import { Container } from "typedi";
import { DataSource } from "typeorm";
import { Axios } from "axios";
import RssParser from "rss-parser";

export async function initContainer() {
  Container.set("port", 3000);
  Container.set(
    DataSource,
    await new DataSource({
      type: "postgres",
      host: process.env.AGGRO_DB_HOST ?? "localhost",
      port: +(process.env.AGGRO_DB_PORT ?? "5432"),
      schema: process.env.AGGRO_DB_SCHEMA ?? "aggro",
      username: process.env.AGGRO_DB_USER ?? "aggro",
      password: process.env.AGGRO_DB_PASSWORD ?? "aggropass",
    }).initialize()
  );
  Container.set(Axios, new Axios({}));
  Container.set(RssParser, new RssParser());
}
