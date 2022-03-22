import { Field, ID, ObjectType } from "type-graphql";
import { FeedEntry } from "./feed-entry";

@ObjectType()
export abstract class Feed {
  constructor(id: string, title: string | undefined, entries: FeedEntry[]) {
    this.id = id;
    this.title = title;
    this.entries = entries;
  }

  @Field(() => ID)
  public readonly id: string;

  @Field(() => String, { nullable: true })
  public readonly title: string | undefined;

  public readonly entries: FeedEntry[];
}
