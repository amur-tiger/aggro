import { createParamDecorator } from "type-graphql";
import { UserEntity } from "../../../domains/user";

export function CurrentUser(): ParameterDecorator {
  return createParamDecorator<{ user: UserEntity }>(({ context }) => {
    if (!context.user) {
      throw new TypeError("Logic Error: User not set.");
    }
    return context.user;
  });
}
