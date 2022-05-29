import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class DiscoveryItem {
  constructor(type: string, title: string, url: string) {
    this.type = type;
    this.title = title;
    this.url = url;
  }

  @Field()
  public readonly type: string;

  @Field()
  public readonly title: string;

  @Field()
  public readonly url: string;
}
