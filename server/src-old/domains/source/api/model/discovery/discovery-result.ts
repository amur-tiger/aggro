import { Field, ObjectType } from "type-graphql";
import { DiscoveryItem } from "./discovery-item";

@ObjectType()
export class DiscoveryResult {
  constructor(items: readonly DiscoveryItem[]) {
    this.items = items;
  }

  @Field(() => [DiscoveryItem])
  public readonly items: readonly DiscoveryItem[];
}
