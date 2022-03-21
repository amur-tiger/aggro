import { Service } from "typedi";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Sources } from "../../sources/sources";
import { AddFeedInput } from "./model/add-feed-input";
import { Feed } from "../../sources/feed";

@Service()
@Resolver()
export class FeedResolver {
  private readonly feedsCache = new Map<string, Feed>();

  public constructor(private readonly sources: Sources) {}

  @Query(() => [Feed])
  public async feeds(): Promise<Feed[]> {
    return Array.from(this.feedsCache.values());
  }

  @Mutation(() => Feed)
  public async addFeed(@Arg("input") { type, uri }: AddFeedInput) {
    const source = await this.sources.getSource(type);
    const feed = await source.getFeed(uri);
    this.feedsCache.set(feed.id, feed);
    return feed;
  }
}
