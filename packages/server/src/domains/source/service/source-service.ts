import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { parse } from "parse5";
import { Arg, Service } from "../../../core/container";
import { SourceHandler } from "../handler/source-handler";
import { FeedHandler } from "../handler/feed/feed-handler";
import { SourceLink } from "../handler/source-link";
import { query } from "../selector/select";
import { wrapJson, wrapNode, WrapQueryInterface } from "../selector/query-interface";

@Service()
export class SourceService {
  private readonly handlers: SourceHandler[];

  public constructor(@Arg("version") private readonly version: string, rssHandler: FeedHandler) {
    this.handlers = [rssHandler];
  }

  public async findSourceLinks(url: string): Promise<SourceLink[]> {
    const queue = [url];
    const result: SourceLink[] = [];

    const proc = async (wrap: WrapQueryInterface, u1: string, doc: any) =>
      result.push(
        ...(
          await Promise.all(
            this.handlers.map((handler) =>
              handler.scanForSource({
                url: u1,
                document: query(wrap, doc),
                addUrl: (u2) => queue.push(u2),
              })
            )
          )
        ).flat()
      );

    while (queue.length > 0) {
      const u3 = queue.pop()!;
      const response = await fetch(u3, {
        headers: {
          "User-Agent": `Aggro/${this.version}`,
        },
      });
      const text = await response.text();

      try {
        const document = await parseStringPromise(text, {
          explicitRoot: false,
          explicitArray: true,
          explicitChildren: true,
          preserveChildrenOrder: true,
        });
        await proc(wrapJson, u3, { "$$": [document] });
      } catch (e) {
        if (e instanceof Error && e.stack && e.stack.includes("strictFail")) {
          const document = parse(text);
          await proc(wrapNode, u3, document);
        } else {
          throw e;
        }
      }
    }

    return result;
  }
}
