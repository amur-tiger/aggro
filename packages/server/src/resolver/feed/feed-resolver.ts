import { Service } from "typedi";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Sources } from "../../sources/sources";
import { Feed } from "../../sources/feed";
import { FeedEntry } from "../../sources/feed-entry";
import { PageInfo } from "../pagination/page-info";
import { Connection } from "../pagination/connection";
import { AddFeedInput } from "./model/add-feed-input";
import { Cursor } from "../pagination/cursor";
import { PaginationArgs } from "../pagination/pagination-args";

const [FeedEntryPage, FeedEntryEdge] = Connection(FeedEntry);

@Service()
@Resolver(() => Feed)
export class FeedResolver {
  private readonly feedsCache = new Map<string, Feed>();

  public constructor(private readonly sources: Sources) {}

  @Query(() => [Feed])
  public async feeds(): Promise<Feed[]> {
    return Array.from(this.feedsCache.values());
  }

  @FieldResolver(() => FeedEntryPage)
  public async entries(
    @Root() feed: Feed,
    @Args() { first, last, before, after }: PaginationArgs
  ) {
    let start = 0;
    let end = feed.entries.length;

    if (after != null) {
      start = after.offset + 1;
    }
    if (before != null) {
      end = before.offset;
    }
    if (first != null && first <= end - start) {
      end = start + first;
    }
    if (last != null && last <= end - start) {
      start = end - last;
    }

    return new FeedEntryPage(
      feed.entries.length,
      new PageInfo(
        start > 0,
        end < feed.entries.length - 2,
        new Cursor(0),
        new Cursor(feed.entries.length - 1)
      ),
      feed.entries
        .slice(start, end)
        .map((entry, idx) => new FeedEntryEdge(new Cursor(start + idx), entry))
    );
  }

  @Mutation(() => Feed)
  public async addFeed(@Arg("input") { type, uri }: AddFeedInput) {
    const source = await this.sources.getSource(type);
    const feed = await source.getFeed(uri);
    this.feedsCache.set(feed.id, feed);
    return feed;
  }
}
