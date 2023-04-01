import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class DiscoveryArgs {
  constructor(url: string) {
    this.url = url;
  }

  @Field()
  public readonly url: string;
}
