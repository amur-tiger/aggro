import { Field, ObjectType } from "type-graphql";
import { Cursor } from "./cursor";

@ObjectType({
  description: "Provides information about the current page.",
})
export class PageInfo {
  constructor(
    hasPreviousPage: boolean,
    hasNextPage: boolean,
    startCursor: Cursor,
    endCursor: Cursor
  ) {
    this.hasPreviousPage = hasPreviousPage;
    this.hasNextPage = hasNextPage;
    this.startCursor = startCursor;
    this.endCursor = endCursor;
  }

  @Field({
    description:
      "Indicates whether more elements exist before the current page.",
  })
  public readonly hasPreviousPage: boolean;

  @Field({
    description:
      "Indicates whether more elements exist after the current page.",
  })
  public readonly hasNextPage: boolean;

  @Field({
    description: "The cursor to the first element of the current page.",
  })
  public readonly startCursor: Cursor;

  @Field({
    description: "The cursor to the last element of the current page.",
  })
  public readonly endCursor: Cursor;
}
