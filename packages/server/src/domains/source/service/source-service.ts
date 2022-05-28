import fetch from "node-fetch";
import { parse } from "parse5";
import { Element, Node, TextNode } from "parse5/dist/tree-adapters/default";
import { Service } from "../../../core/container";

@Service()
export class SourceService {
  public constructor() {
    // constructor is needed for di container
  }

  private search(element: Node, test: (node: Node) => boolean): Node | undefined {
    if (test(element)) {
      return element;
    }
    if ("childNodes" in element) {
      for (const node of element.childNodes) {
        const result = this.search(node, test);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  public async findSourceTitle(url: string): Promise<string> {
    const response = await fetch(url);
    const parsed = parse(await response.text());

    const titleNode = this.search(parsed, (node) => node.nodeName.toLowerCase() === "title");
    if (titleNode) {
      return (titleNode as Element).childNodes.map((node) => (node as TextNode).value).join();
    }

    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  }
}
