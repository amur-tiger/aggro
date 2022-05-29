import { wrapJson, wrapNode } from "./query-interface";
import { TextNode } from "parse5/dist/tree-adapters/default";

describe(wrapJson, () => {
  it("should return children", () => {
    const children = wrapJson({ "#name": "", $$: [{ "#name": "a" }, { "#name": "b" }] }).getChildren();

    expect(children).toStrictEqual([{ "#name": "a" }, { "#name": "b" }]);
  });

  it("should return nothing without children", () => {
    const children = wrapJson({ "#name": "" }).getChildren();

    expect(children).toStrictEqual([]);
  });

  it("should return tag name", () => {
    const tagName = wrapJson({ "#name": "a" }).getTagName();

    expect(tagName).toStrictEqual("a");
  });

  it("should return attribute", () => {
    const attribute = wrapJson({ "#name": "", $: { a: "1" } }).getAttribute("a");

    expect(attribute).toStrictEqual("1");
  });

  it("should return null if no attribute present", () => {
    const attribute = wrapJson({ "#name": "" }).getAttribute("a");

    expect(attribute).toBeNull();
  });

  it("should return null if attribute not found", () => {
    const attribute = wrapJson({ "#name": "", $: {} }).getAttribute("a");

    expect(attribute).toBeNull();
  });

  it("should return null if no text content present", () => {
    const text = wrapJson({ "#name": "" }).getTextContent();

    expect(text).toBeNull();
  });

  it("should return text content", () => {
    const text = wrapJson({ "#name": "", _: "text" }).getTextContent();

    expect(text).toStrictEqual("text");
  });
});

describe(wrapNode, () => {
  it("should return children", () => {
    const children = wrapNode({
      childNodes: [
        // @ts-ignore
        { nodeName: "#text", parentNode: null, value: "a" },
        // @ts-ignore
        { nodeName: "#text", parentNode: null, value: "b" },
      ],
    }).getChildren();

    expect(children).toStrictEqual([
      { nodeName: "#text", parentNode: null, value: "a" },
      { nodeName: "#text", parentNode: null, value: "b" },
    ]);
  });

  it("should return attribute", () => {
    // @ts-ignore
    const attribute = wrapNode({ attrs: [{ name: "a", value: "1" }] }).getAttribute("a");

    expect(attribute).toStrictEqual("1");
  });

  it("should return null if no attribute present", () => {
    // @ts-ignore
    const attribute = wrapNode({}).getAttribute("a");

    expect(attribute).toBeNull();
  });

  it("should return null if attribute not found", () => {
    // @ts-ignore
    const attribute = wrapNode({ attrs: [{ name: "a", value: "1" }] }).getAttribute("b");

    expect(attribute).toBeNull();
  });

  it("should return null if no text content present", () => {
    // @ts-ignore
    const text = wrapNode({}).getTextContent();

    expect(text).toBeNull();
  });

  it("should return text content", () => {
    // @ts-ignore
    const text = wrapNode({ name: "#text", value: "abc" }).getTextContent();

    expect(text).toStrictEqual("abc");
  });
});
