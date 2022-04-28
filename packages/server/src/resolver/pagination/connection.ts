import { ClassType, Field, Int, ObjectType } from "type-graphql";
import { PageInfo } from "./page-info";
import { Edge } from "./edge";

/**
 * @param TItemClass
 * @constructor
 * @see https://relay.dev/graphql/connections.htm
 */
export function Connection<TItem>(TItemClass: ClassType<TItem>) {
  const EdgeClass = Edge(TItemClass);
  type EdgeType = InstanceType<typeof EdgeClass>;

  @ObjectType(`${TItemClass.name}Connection`)
  class ConnectionClass {
    constructor(totalCount: number, pageInfo: PageInfo, edges: EdgeType[]) {
      this.totalCount = totalCount;
      this.pageInfo = pageInfo;
      this.edges = edges;
    }

    @Field(() => Int)
    public readonly totalCount: number;

    @Field(() => PageInfo)
    public readonly pageInfo: PageInfo;

    @Field(() => [EdgeClass])
    public readonly edges: EdgeType[];
  }

  return [ConnectionClass, EdgeClass] as const;
}
