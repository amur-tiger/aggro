import fetch from "node-fetch";
import { SourceHandler } from "../source-handler";
import { Arg, Service } from "../../../../core/container";
import { ScanContext } from "../scan-context";
import { SourceLink } from "../source-link";

@Service()
export class E621Handler implements SourceHandler {
  public constructor(@Arg("version") private readonly version: string) {}

  public async scanForSource({ url }: ScanContext): Promise<SourceLink[]> {
    const baseUrl = new URL(url);
    if (baseUrl.hostname !== "e621.net" && baseUrl.hostname !== "e926.net") {
      return [];
    }

    if (baseUrl.pathname === "/posts") {
      const tags = baseUrl.searchParams.get("tags")?.trim();
      const u2 = new URL(`/posts.json${tags ? "?tags=" + tags : ""}`, baseUrl);

      return [
        {
          url: u2.toString(),
          type: "e621",
          title: `e621: ${tags}`,
        },
      ];
    }

    const test = /^\/pools\/(\d+)$/;
    const match = test.exec(baseUrl.pathname);
    if (match) {
      const poolId = match[1];
      const response = await fetch(new URL(`/pools.json?search[id]=${poolId}`, baseUrl).toString(), {
        headers: {
          "User-Agent": `Aggro/${this.version}`,
        },
      });
      const json = await response.json();
      if (Array.isArray(json) && json.length > 0) {
        const u2 = new URL(`/posts.json?tags=pool%3A${poolId}`, baseUrl);

        return [
          {
            url: u2.toString(),
            type: "e621",
            title: json[0].name.replace(/_/g, " "),
          },
        ];
      }
    }

    return [];
  }
}
