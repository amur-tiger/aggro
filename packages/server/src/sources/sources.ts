import { Container, Service } from "typedi";
import { RssSource } from "./rss/rss-source";

@Service()
export class Sources {
  public async getSource(type: string) {
    const handler = {
      rss: RssSource,
    }[type];

    if (!handler) {
      throw new Error(`Unknown source type: ${type}`);
    }

    return Container.get(handler);
  }
}
