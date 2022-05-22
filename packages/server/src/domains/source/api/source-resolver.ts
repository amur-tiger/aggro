import { randomUUID } from "crypto";
import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import {
  Connection,
  CurrentUser,
  Cursor,
  PageInfo,
  PaginationArgs,
} from "../../../core/api";
import { Service } from "../../../core/container";
import { Filter } from "../../../core/database";
import { UserEntity } from "../../user";
import { SourceSort } from "./model/source-sort";
import { SourceEntity } from "../repository/model/source-entity";
import { SourceRepository } from "../repository/source-repository";
import { Source } from "./model/source";
import { AddSourceInput } from "./model/add-source-input";

const [SourcePage, SourceEdge] = Connection(Source);

@Service()
@Resolver(() => Source)
export class SourceResolver {
  private static readonly sortMap: Record<SourceSort, keyof SourceEntity> = {
    TITLE: "title",
    DATE_ADDED: "added",
    LAST_UPDATED: "lastupdate",
  };

  public constructor(private readonly repository: SourceRepository) {}

  @Query(() => SourcePage, {
    description: "Returns a list of sources for the current user.",
  })
  public async sources(
    @CurrentUser() user: UserEntity,
    @Args() args: PaginationArgs,
    @Arg("orderBy", () => SourceSort, { nullable: true })
    orderBy: SourceSort | undefined
  ) {
    const sortField = (orderBy && SourceResolver.sortMap[orderBy]) || "title";

    const sources = await this.repository.find(
      new Filter(sortField).user(user).fromPagination(args)
    );

    return new SourcePage(
      await this.repository.count(new Filter(sortField).user(user)),
      new PageInfo(
        false,
        false,
        new Cursor(sources[0]?.id),
        new Cursor(sources[sources.length - 1]?.id)
      ),
      sources.map(
        (s) =>
          new SourceEdge(
            new Cursor(s.id),
            new Source(s.id, s.type, s.title, s.uri, s.added, s.lastupdate)
          )
      )
    );
  }

  @Mutation(() => Source)
  public async addSource(
    @CurrentUser() user: UserEntity,
    @Arg("input") { type, title, uri }: AddSourceInput
  ) {
    const source: SourceEntity = {
      id: randomUUID(),
      userid: user.id,
      type,
      title,
      uri,
      added: new Date(),
      lastupdate: null,
    };

    await this.repository.insert(source);
    return new Source(
      source.id,
      source.type,
      source.title,
      source.uri,
      source.added,
      source.lastupdate
    );
  }
}
