export interface SelectorElement {
  directChild?: boolean;
  tagName?: string;
  attribute?: [string, (test: string) => boolean];
}

const isWhitespace = /\s/;

export function split(str: string): string[] {
  const result: string[] = [];

  let isInWord = false;
  let isInBracket = false;
  let hasOperator = false;
  let offset = 0;
  for (let i = 0; i < str.length; i++) {
    switch (true) {
      case isWhitespace.test(str[i]):
        if (!isInBracket && !hasOperator) {
          if (isInWord) {
            result.push(str.slice(offset, i));
          }
          isInWord = false;
        }
        break;
      case str[i] === ">":
        if (isInWord) {
          result.push(str.slice(offset, i));
          isInWord = false;
        }
        hasOperator = true;
        offset = i;
        break;
      case str[i] === "]":
        isInBracket = false;
        break;
      case str[i] === "[":
        isInBracket = true;
      // noinspection FallThroughInSwitchStatementJS
      default:
        if (!isInWord && !hasOperator) {
          offset = i;
        }
        isInWord = true;
        break;
    }
  }
  if (isInWord) {
    result.push(str.slice(offset));
  }
  return result;
}

export function parseSelector(selector: string): SelectorElement[] {
  return split(selector).map((select) => {
    const bracketPos = select.indexOf("[");
    if (bracketPos < 0) {
      if (select.startsWith(">")) {
        return {
          tagName: select.slice(1).trim(),
          directChild: true,
        };
      }

      return {
        tagName: select,
      };
    }

    const result: SelectorElement = {};
    const tagName = select.slice(0, bracketPos);
    if (tagName) {
      if (tagName.startsWith(">")) {
        result.tagName = tagName.slice(1).trim();
        result.directChild = true;
      } else {
        result.tagName = tagName;
      }
    }

    const attrs = select.slice(bracketPos + 1, -1);
    const eqPos = attrs.indexOf("=");

    if (eqPos < 0) {
      result.attribute = [attrs, () => true];
    } else {
      const val = attrs
        .slice(eqPos + 1)
        .replace(/^['"]/, "")
        .replace(/['"]$/, "");
      const mod = attrs[eqPos - 1];
      switch (mod) {
        case "~":
          result.attribute = [attrs.slice(0, eqPos - 1), (s) => s.split(/\s+/).includes(val)];
          break;
        case "|":
          result.attribute = [attrs.slice(0, eqPos - 1), (s) => s === val || s.startsWith(`${val}-`)];
          break;
        case "^":
          result.attribute = [attrs.slice(0, eqPos - 1), (s) => s.startsWith(val)];
          break;
        case "$":
          result.attribute = [attrs.slice(0, eqPos - 1), (s) => s.endsWith(val)];
          break;
        case "*":
          result.attribute = [attrs.slice(0, eqPos - 1), (s) => s.includes(val)];
          break;
        default:
          result.attribute = [attrs.slice(0, eqPos), (s) => s === val];
          break;
      }
    }
    return result;
  });
}
