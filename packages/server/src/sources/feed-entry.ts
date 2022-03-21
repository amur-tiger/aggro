import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class FeedEntry {
  constructor(id: string, title: string | undefined, link: string | undefined) {
    this.id = id;
    this.title = title;
    this.link = link;
  }

  @Field(() => ID)
  public readonly id: string;

  @Field(() => String, { nullable: true })
  public readonly title: string | undefined;

  @Field(() => String, { nullable: true })
  public readonly link: string | undefined;
}
