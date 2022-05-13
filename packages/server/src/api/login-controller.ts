import { Service } from "typedi";
import { Request } from "express";
import { Route } from "../service/api/route";
import { SessionService } from "../service/session/session-service";
import { UserService } from "../service/user/user-service";
import { getAuthToken, getRequiredParameter } from "../service/api/utils";
import { UnauthorizedException } from "../service/api/unauthorized-exception";

@Service()
export class LoginController {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  @Route({ method: "POST", pattern: "/login" })
  public async login(req: Request) {
    const mail = getRequiredParameter(req, "mail");
    const password = getRequiredParameter(req, "password");

    const user = await this.userService.findByMail(mail);
    if (!user || !(await this.userService.isValidPassword(user, password))) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const session = await this.sessionService.startSession(user);

    return {
      token: session.id,
    };
  }

  @Route({ method: "POST", pattern: "/logout" })
  public async logout(req: Request) {
    const auth = getAuthToken(req);
    const session = await this.sessionService.findSession(auth);
    if (!session) {
      throw new UnauthorizedException("Invalid authorization token.");
    }
    await this.sessionService.closeSession(session);
  }
}
