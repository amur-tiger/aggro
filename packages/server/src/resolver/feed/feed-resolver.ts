import { Query, Resolver } from "type-graphql";
import { Feed } from "./model/feed";

@Resolver()
export class FeedResolver {
  @Query(() => [Feed])
  public async feeds(): Promise<Feed[]> {
    return [new Feed("test")];
  }
}
