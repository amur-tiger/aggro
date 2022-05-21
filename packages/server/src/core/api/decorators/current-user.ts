import { createParamDecorator } from "type-graphql";
import {User} from "../../../domains/user/repository/model/user";

export function CurrentUser(): ParameterDecorator {
  return createParamDecorator<{ user: User }>(({ context }) => {
    if (!context.user) {
      throw new TypeError("Logic Error: User not set.");
    }
    return context.user;
  });
}
