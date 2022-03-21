import { Container } from "typedi";
import { Axios } from "axios";
import RssParser from "rss-parser";

export async function initContainer() {
  Container.set("port", 3000);
  Container.set(Axios, new Axios({}));
  Container.set(RssParser, new RssParser());
}
