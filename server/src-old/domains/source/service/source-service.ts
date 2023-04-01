import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { parse } from "parse5";
import { Arg, Service } from "../../../core/container";
import { SourceHandler } from "../handler/source-handler";
import { SourceLink } from "../handler/source-link";
import { query } from "../selector/select";
import { wrapJson, wrapNode, WrapQueryInterface } from "../selector/query-interface";
import { Logger } from "../../../core/logger";

@Service()
export class SourceService {
  private readonly logger = new Logger(SourceService);
  private readonly faviconCache = new Map<string, [number, Promise<string>]>();

  public constructor(
    @Arg("version") private readonly version: string,
    @Arg("source-handlers") private readonly handlers: SourceHandler[]
  ) {}

  public async findSourceLinks(url: string): Promise<SourceLink[]> {
    const queue = [url];
    const result: SourceLink[] = [];

    const proc = async (wrap: WrapQueryInterface, u1: string, doc: any) => {
      const sources = (
        await Promise.all(
          this.handlers.map((handler) =>
            handler.scanForSource({
              url: u1,
              document: query(wrap, doc),
              addUrl: (u2) => queue.push(u2),
            })
          )
        )
      ).flat();

      sources.forEach((s) => this.logger.debug(`Discovered "${s.title}" (${s.type}) at ${s.url}`));

      return result.push(...sources);
    };

    while (queue.length > 0) {
      const u3 = queue.pop()!;
      this.logger.info(`Discovering sources from ${u3}`);

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
        await proc(wrapJson, u3, { $$: [document] });
      } catch (e) {
        if (e instanceof Error && e.stack && e.stack.includes("strictFail")) {
          const document = parse(text);
          await proc(wrapNode, u3, document);
        } else {
          throw e;
        }
      }
    }

    this.logger.info(`Discovered ${result.length} sources at ${url}`);
    return result;
  }

  public async findFavicon(link: string): Promise<string> {
    const url = new URL(link);
    const existing = this.faviconCache.get(url.origin);
    if (existing) {
      const [stamp, iconUrl] = existing;
      if (stamp + 60 * 1000 > Date.now()) {
        this.logger.debug(`Returning favicon at ${url.origin} from cache`);
        return iconUrl;
      }
    }

    const promise = this.findFaviconActual(url);
    this.faviconCache.set(url.origin, [Date.now(), promise]);
    return promise;
  }

  private async findFaviconActual(url: URL): Promise<string> {
    this.logger.debug(`Searching favicon at ${url.origin}`);
    const favicons: { url: string; sizes: string }[] = [];

    try {
      const manifestResponse = await fetch(`${url.origin}/manifest.json`, {
        headers: {
          "User-Agent": `Aggro/${this.version}`,
        },
      });

      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json();
        if (manifest && typeof manifest === "object" && Array.isArray(manifest.icons)) {
          for (const icon of manifest.icons) {
            const iconUrl = new URL(icon.src, url.origin).toString();
            this.logger.debug(`Found favicon at ${iconUrl} (via manifest)`);
            favicons.push({
              url: iconUrl,
              sizes: icon.sizes,
            });
          }
        }
      }
    } catch (e) {
      this.logger.debug(`Site at ${url.origin} does not have valid manifest`);
    }

    if (favicons.length === 0) {
      try {
        const response = await fetch(url.origin, {
          headers: {
            "User-Agent": `Aggro/${this.version}`,
          },
        });

        const text = await response.text();
        const document = query(wrapNode, parse(text));

        const appleTouchIcon = document.select("link[rel=apple-touch-icon]");
        const appleTouchIconHref = appleTouchIcon.attr("href");
        if (appleTouchIconHref) {
          const iconUrl = new URL(appleTouchIconHref, url.origin).toString();
          this.logger.debug(`Found favicon at ${iconUrl} (via apple touch icon)`);
          favicons.push({
            url: iconUrl,
            sizes: appleTouchIcon.attr("sizes") ?? "180x180",
          });
        }

        const links = document.select("link[rel~=icon]");
        for (const link of links) {
          const href = link.attr("href");
          if (href) {
            const iconUrl = new URL(href, url.origin).toString();
            this.logger.debug(`Found favicon at ${iconUrl} (via link)`);
            favicons.push({
              url: iconUrl,
              sizes: link.attr("sizes") ?? "32x32",
            });
          }
        }
      } catch (e) {
        this.logger.debug(`Failed to extract favicon from HTML`);
        this.logger.debug(e);
      }
    }

    favicons.push({
      url: url.origin + "/favicon.ico",
      sizes: "32x32",
    });

    const favicon = favicons.reduce((previous, current) => {
      const reducer = (p: number, c: string): number =>
        c === "any" ? Number.MAX_SAFE_INTEGER : Math.max(p, +c.split("x")[0]);
      const prevSize = previous.sizes.split(/\s+/).reduce(reducer, 0);
      const currSize = current.sizes.split(/\s+/).reduce(reducer, 0);

      if (prevSize === currSize) {
        if (previous.url.endsWith(".ico")) {
          return current;
        }
        if (current.url.endsWith(".ico")) {
          return previous;
        }
      }
      return prevSize > currSize ? previous : current;
    });

    this.logger.debug(`Selected favicon at ${favicon.url}`);
    return favicon.url;
  }
}
