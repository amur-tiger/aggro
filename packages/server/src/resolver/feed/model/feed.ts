import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Feed {
  constructor(id: string) {
    this.id = id;
  }

  @Field(() => ID)
  private readonly id: string;
}
