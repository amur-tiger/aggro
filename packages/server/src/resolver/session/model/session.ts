import { Field, ID, ObjectType } from "type-graphql";
import { Session as DbSession } from "../../../service/session/model/session";

@ObjectType()
export class Session {
  constructor(session: DbSession) {
    this.token = session.id;
  }

  @Field(() => ID)
  public readonly token: string;
}
