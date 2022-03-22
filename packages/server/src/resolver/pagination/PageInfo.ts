import { Field, ObjectType } from "type-graphql";
import { Cursor } from "./Cursor";

@ObjectType()
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

  @Field()
  public readonly hasPreviousPage: boolean;

  @Field()
  public readonly hasNextPage: boolean;

  @Field()
  public readonly startCursor: Cursor;

  @Field()
  public readonly endCursor: Cursor;
}
