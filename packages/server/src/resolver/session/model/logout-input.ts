import { Field, ID, InputType } from "type-graphql";

@InputType()
export class LogoutInput {
  constructor(token: string) {
    this.token = token;
  }

  @Field(() => ID)
  public readonly token: string;
}
