import { Container } from "typedi";
import { Axios } from "axios";
import RssParser from "rss-parser";

export function initContainer() {
  Container.set(Axios, new Axios({}));
  Container.set(RssParser, new RssParser());
}
