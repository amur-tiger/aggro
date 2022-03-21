import { Service } from "typedi";
import { Axios } from "axios";
import RssParser from "rss-parser";
import { RssFeed } from "./rss-feed";
import { FeedEntry } from "../feed-entry";

@Service()
export class RssSource {
  public constructor(
    private readonly client: Axios,
    private readonly parser: RssParser
  ) {}

  public async getFeed(uri: string) {
    const { data } = await this.client.get(uri);
    const rss = await this.parser.parseString(data);

    return new RssFeed(
      "rss+" + uri,
      rss.title,
      rss.items.map((i) => new FeedEntry(i.guid ?? "?", i.title, i.link))
    );
  }
}
