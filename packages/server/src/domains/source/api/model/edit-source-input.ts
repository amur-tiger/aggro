import { Field, ID, InputType } from "type-graphql";

@InputType()
export class EditSourceInput {
  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  @Field(() => ID)
  public readonly id: string;

  @Field()
  public readonly title: string;
}
