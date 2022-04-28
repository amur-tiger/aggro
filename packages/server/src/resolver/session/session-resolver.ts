import { Arg, Mutation, Resolver } from "type-graphql";
import { LoginInput } from "./model/login-input";
import { LogoutInput } from "./model/logout-input";
import { Session } from "./model/session";
import { UserService } from "../../service/user/user-service";
import { SessionService } from "../../service/session/session-service";
import { CredentialsException } from "./exceptions/credentials-exception";

@Resolver()
export class SessionResolver {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  @Mutation(() => Session)
  public async login(
    @Arg("input") { mail, password }: LoginInput
  ): Promise<Session> {
    const user = await this.userService.findByMail(mail);
    if (!user) {
      throw new CredentialsException();
    }

    const isValid = await this.userService.isValidPassword(user, password);
    if (!isValid) {
      throw new CredentialsException();
    }

    return new Session(await this.sessionService.startSession(user));
  }

  @Mutation(() => Session, { nullable: true })
  public async logout(
    @Arg("input") { token }: LogoutInput
  ): Promise<Session | null> {
    const session = await this.sessionService.findSession(token);
    if (!session) {
      return null;
    }

    await this.sessionService.closeSession(session);

    return new Session(session);
  }
}
