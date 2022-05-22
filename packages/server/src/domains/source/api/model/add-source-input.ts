import { Field, InputType } from "type-graphql";

@InputType()
export class AddSourceInput {
  constructor(type: string, title: string, uri: string) {
    this.type = type;
    this.title = title;
    this.uri = uri;
  }

  @Field()
  public readonly type: string;

  @Field()
  public readonly title: string;

  @Field()
  public readonly uri: string;
}
