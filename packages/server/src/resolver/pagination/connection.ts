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

  @ObjectType(`${TItemClass.name}Connection`, {
    description: `A pageable list for {@link ${TItemClass.name}} elements that also contains meta information.`,
  })
  class ConnectionClass {
    constructor(totalCount: number, pageInfo: PageInfo, edges: EdgeType[]) {
      this.totalCount = totalCount;
      this.pageInfo = pageInfo;
      this.edges = edges;
    }

    @Field(() => Int, {
      description: "The total number of elements across all pages.",
    })
    public readonly totalCount: number;

    @Field(() => PageInfo, {
      description: "Contains meta information about the current page.",
    })
    public readonly pageInfo: PageInfo;

    @Field(() => [EdgeClass], {
      description: "Contains the edges of the current page.",
    })
    public readonly edges: EdgeType[];
  }

  return [ConnectionClass, EdgeClass] as const;
}
