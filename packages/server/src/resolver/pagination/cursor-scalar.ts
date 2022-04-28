import { GraphQLScalarType, Kind } from "graphql";
import { Buffer } from "buffer";
import { Cursor } from "./cursor";

function encode(cursor: Cursor) {
  const data = JSON.stringify({ offset: cursor.offset });
  const buffer = Buffer.from(data);
  return buffer.toString("base64");
}

function decode(cursor: string) {
  try {
    const buffer = Buffer.from(cursor, "base64");
    const data = buffer.toString("utf-8");
    const parsed = JSON.parse(data);
    return new Cursor(parsed.offset);
  } catch (e) {
    return new Cursor(0);
  }
}

export const CursorScalar = new GraphQLScalarType({
  name: "Cursor",
  serialize(value: unknown) {
    if (!(value instanceof Cursor)) {
      throw new TypeError("CursorScalar can only serialize Cursor objects.");
    }
    return encode(value);
  },
  parseValue(value: unknown) {
    if (typeof value !== "string") {
      throw new TypeError("CursorScalar can only parse string values.");
    }
    return decode(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError("CursorScalar can only parse string values.");
    }
    return decode(ast.value);
  },
});
