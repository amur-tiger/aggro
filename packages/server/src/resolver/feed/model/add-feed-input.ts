import { Field, InputType } from "type-graphql";

@InputType()
export class AddFeedInput {
  constructor(type: string, uri: string) {
    this.type = type;
    this.uri = uri;
  }

  @Field()
  public readonly type: string;

  @Field()
  public readonly uri: string;
}
