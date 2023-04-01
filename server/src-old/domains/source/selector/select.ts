import { QueryInterface, WrapQueryInterface } from "./query-interface";
import { parseSelector, SelectorElement } from "./selector";

function matches(node: QueryInterface<any>, select: SelectorElement): boolean {
  if (select.tagName != null && select.tagName !== node.getTagName()) {
    return false;
  }
  if (select.attribute != null) {
    const [name, test] = select.attribute;
    const value = node.getAttribute(name);
    return value != null && test(value);
  }
  return true;
}

function makeSearch(wrap: WrapQueryInterface): (node: any, select: SelectorElement) => any[] {
  const search = (n: any, select: SelectorElement): any[] => {
    const result = [];
    const node = wrap(n);
    for (const child of node.getChildren()) {
      if (matches(wrap(child), select)) {
        result.push(child);
      } else if (!select.directChild) {
        result.push(...search(child, select));
      }
    }
    return result;
  };
  return search;
}

export interface Query<T = any> extends Iterable<Query<T>> {
  length: number;

  select(selector: string): Query<T>;

  first(): Query<T>;

  attr(name: string): string | null;

  textContent(): string | null;
}

export function query<T = any>(wrap: WrapQueryInterface<T>, node: unknown): Query<T> {
  const search = makeSearch(wrap);
  const current = Array.isArray(node) ? node : [node];
  return {
    length: current.length,

    select(selector: string): Query {
      const selectors = parseSelector(selector);

      let nodes = current;
      for (const select of selectors) {
        nodes = nodes.flatMap((n) => search(n, select));
      }

      return query(wrap, nodes);
    },

    first(): Query {
      return query(wrap, current.length > 0 ? current[0] : []);
    },

    attr(name: string): string | null {
      if (current.length === 0) {
        return null;
      }
      return wrap(current[0]).getAttribute(name);
    },

    textContent(): string | null {
      if (current.length === 0) {
        return null;
      }
      let content = "";
      for (const n of current) {
        content += wrap(n).getTextContent();
      }
      return content;
    },

    *[Symbol.iterator](): Iterator<Query> {
      for (const n of current) {
        yield query(wrap, n);
      }
    },
  };
}
