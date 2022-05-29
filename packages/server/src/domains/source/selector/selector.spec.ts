import { parseSelector, split } from "./selector";

describe(split, () => {
  it("should return single element", () => {
    const selectors = split("node");

    expect(selectors).toStrictEqual(["node"]);
  });

  it("should return two elements", () => {
    const selectors = split(" node1  node2  ");

    expect(selectors).toStrictEqual(["node1", "node2"]);
  });

  it("should not split in attribute selector", () => {
    const selectors = split("node1[attr='hello world'] node2");

    expect(selectors).toStrictEqual(["node1[attr='hello world']", "node2"]);
  });

  it("should split with lonely attribute selector", () => {
    const selectors = split("node1 [attr=val]");

    expect(selectors).toStrictEqual(["node1", "[attr=val]"]);
  });

  it('should prepend direct descendant to next selector', () => {
    const selectors = split("node1 > node2");

    expect(selectors).toStrictEqual(["node1", "> node2"]);
  });

  it('should split squished operator', () => {
    const selectors = split("node1>node2");

    expect(selectors).toStrictEqual(["node1", ">node2"]);
  });
});

describe(parseSelector, () => {
  it("should parse tag name", () => {
    const selectors = parseSelector("node");

    expect(selectors).toStrictEqual([{ tagName: "node" }]);
  });

  it("should parse separate tag names", () => {
    const selectors = parseSelector("node1 node2");

    expect(selectors).toStrictEqual([{ tagName: "node1" }, { tagName: "node2" }]);
  });

  it("should parse attribute", () => {
    const selectors = parseSelector("[attr]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("")).toBe(true);
    expect(selectors[0].attribute![1]("value")).toBe(true);
  });

  it("should parse equals attribute", () => {
    const selectors = parseSelector("[attr=value]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("")).toBe(false);
    expect(selectors[0].attribute![1]("value")).toBe(true);
  });

  it("should parse list attribute", () => {
    const selectors = parseSelector("[attr~=b]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("a c e")).toBe(false);
    expect(selectors[0].attribute![1]("a b c")).toBe(true);
  });

  it("should parse eq-dash attribute", () => {
    const selectors = parseSelector("[attr|=en]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("de")).toBe(false);
    expect(selectors[0].attribute![1]("en")).toBe(true);
    expect(selectors[0].attribute![1]("en-US")).toBe(true);
  });

  it("should parse starts with attribute", () => {
    const selectors = parseSelector("[attr^=val]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("coeval")).toBe(false);
    expect(selectors[0].attribute![1]("valdemar")).toBe(true);
  });

  it("should parse ends with attribute", () => {
    const selectors = parseSelector("[attr$=val]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("valdemar")).toBe(false);
    expect(selectors[0].attribute![1]("coeval")).toBe(true);
  });

  it("should parse includes attribute", () => {
    const selectors = parseSelector("[attr*=val]");

    expect(selectors).toStrictEqual([{ attribute: ["attr", expect.any(Function)] }]);
    expect(selectors[0].attribute![1]("undo")).toBe(false);
    expect(selectors[0].attribute![1]("devalue")).toBe(true);
  });

  it('should parse direct descendant operator', () => {
    const selectors = parseSelector("node1 > node2");

    expect(selectors).toStrictEqual([{ tagName: "node1" }, { tagName: "node2", directChild: true }]);
  });
});
