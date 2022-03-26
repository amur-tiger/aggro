import { Container } from "typedi";
import { DataSource } from "typeorm";
import { Axios } from "axios";
import RssParser from "rss-parser";

export async function initContainer() {
  Container.set("port", 3000);
  Container.set(
    DataSource,
    await new DataSource({
      type: "sqlite",
      database: "./data.sqlite",
    }).initialize()
  );
  Container.set(Axios, new Axios({}));
  Container.set(RssParser, new RssParser());
}
