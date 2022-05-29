import { Service } from "../../../../core/container";
import { SourceHandler } from "../source-handler";
import { SourceLink } from "../source-link";
import { ScanContext } from "../scan-context";

@Service()
export class FeedHandler implements SourceHandler {
  public constructor() {}

  public async scanForSource({ url, document, addUrl }: ScanContext): Promise<SourceLink[]> {
    const rssFeedTitle = document.select("rss channel > title").textContent();
    if (rssFeedTitle != null) {
      return [
        {
          type: "rss",
          url,
          title: rssFeedTitle,
        },
      ];
    }

    const atomFeedTitle = document.select("feed[xmlns='http://www.w3.org/2005/Atom'] > title").textContent();
    if (atomFeedTitle != null) {
      return [
        {
          type: "atom",
          url,
          title: atomFeedTitle,
        },
      ];
    }

    const result: SourceLink[] = [];
    const rssLink = document.select("link[type='application/rss+xml']").attr("href");
    if (rssLink) {
      const resolved = new URL(rssLink, url);
      addUrl(resolved.href);
    }

    const atomLink = document.select("link[type='application/atom+xml']").attr("href");
    if (atomLink) {
      const resolved = new URL(atomLink, url);
      addUrl(resolved.href);
    }

    return result;
  }
}
