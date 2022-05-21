import { ArgsType, Field, Int } from "type-graphql";
import { Min } from "class-validator";
import { Cursor } from "./cursor";

@ArgsType()
export class PaginationArgs {
  @Min(0)
  @Field(() => Int, { nullable: true })
  public readonly first?: number;

  @Min(0)
  @Field(() => Int, { nullable: true })
  public readonly last?: number;

  @Field({ nullable: true })
  public readonly before?: Cursor;

  @Field({ nullable: true })
  public readonly after?: Cursor;
}
