import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Source {
  constructor(
    id: string,
    type: string,
    title: string,
    uri: string,
    added: Date,
    lastUpdate: Date | null
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.uri = uri;
    this.added = added;
    this.lastUpdate = lastUpdate;
  }

  @Field(() => ID)
  public readonly id: string;

  @Field()
  public readonly type: string;

  @Field()
  public readonly title: string;

  @Field()
  public readonly uri: string;

  @Field()
  public readonly added: Date;

  @Field(() => Date, { nullable: true })
  public readonly lastUpdate: Date | null;
}
