import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  constructor(mail: string, password: string) {
    this.mail = mail;
    this.password = password;
  }

  @Field()
  public readonly mail: string;

  @Field()
  public readonly password: string;
}
