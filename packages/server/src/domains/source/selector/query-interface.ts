import { Attribute } from "parse5/dist/common/token";
import { Node } from "parse5/dist/tree-adapters/default";

export interface QueryInterface<T> {
  getChildren(): any[];

  getTagName(): string;

  getAttribute(attribute: string): string | null;

  getTextContent(): string | null;
}

export interface WrapQueryInterface<T = any> {
  (node: T): QueryInterface<T>;
}

interface JsonNode {
  "#name": string;
  $?: Record<string, any>;
  $$?: JsonNode[];
  _?: string;
}

export function wrapJson(node: JsonNode): QueryInterface<JsonNode> {
  if (Array.isArray(node)) {
    throw new TypeError("Cannot wrap array.");
  }

  return {
    getChildren() {
      return node.$$ ?? [];
    },

    getTagName() {
      return node["#name"];
    },

    getAttribute(attribute) {
      return node.$?.[attribute] ?? null;
    },

    getTextContent() {
      return node._ ?? null;
    },
  };
}

export function wrapNode(node: Node): QueryInterface<Node> {
  if (Array.isArray(node)) {
    throw new TypeError("Cannot wrap array.");
  }

  return {
    getChildren() {
      if ("childNodes" in node) {
        return node.childNodes;
      }
      return [];
    },

    getTagName() {
      return node.nodeName;
    },

    getAttribute(attribute) {
      if ("attrs" in node) {
        return node.attrs.find((a: Attribute) => a.name === attribute)?.value ?? null;
      }
      return null;
    },

    getTextContent() {
      if ("value" in node) {
        return node.value;
      }
      return null;
    },
  };
}
