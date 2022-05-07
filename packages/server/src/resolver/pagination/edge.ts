import { ClassType, Field, ObjectType } from "type-graphql";
import { Cursor } from "./cursor";

export function Edge<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType(`${TItemClass.name}Edge`, {
    description: `Edge type for {@link ${TItemClass.name}} elements.`,
  })
  class EdgeClass {
    public constructor(cursor: Cursor, node: TItem) {
      this.cursor = cursor;
      this.node = node;
    }

    @Field({
      description:
        "The cursor pointing to the element within the {@link node} field.",
    })
    public readonly cursor: Cursor;

    @Field(() => TItemClass, { description: "The current element." })
    public readonly node: TItem;
  }

  return EdgeClass;
}
