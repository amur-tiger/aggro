import { ClassType, Field, ObjectType } from "type-graphql";
import { Cursor } from "./cursor";

export function Edge<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType(`${TItemClass.name}Edge`)
  class EdgeClass {
    public constructor(cursor: Cursor, node: TItem) {
      this.cursor = cursor;
      this.node = node;
    }

    @Field()
    public readonly cursor: Cursor;

    @Field(() => TItemClass)
    public readonly node: TItem;
  }

  return EdgeClass;
}
