import { Service } from "typedi";
import { Request, Response } from "express";
import { Route } from "../service/api/decorators/route";
import { Public } from "../service/api/decorators/public";
import { SessionService } from "../service/session/session-service";
import { UserService } from "../service/user/user-service";
import { getRequiredParameter } from "../service/api/utils";
import { UnauthorizedException } from "../service/api/exceptions/unauthorized-exception";

@Service()
export class LoginController {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  @Public()
  @Route()
  public async me(req: Request) {
    const token = req.cookies.token;

    if (!token) {
      return {
        isLoggedIn: false,
        message: "Unauthorized (no token given)",
      };
    }

    const session = await this.sessionService.findSession(token, {
      loadUser: true,
    });
    if (!session) {
      return {
        isLoggedIn: false,
        message: "Unauthorized (invalid token)",
      };
    }

    return {
      isLoggedIn: true,
      message: "Logged in",
      session: {
        created: session.created,
      },
      user: {
        id: session.user.id,
        username: session.user.username,
        mail: session.user.mail,
        registered: session.user.registered,
      },
    };
  }

  @Public()
  @Route({ method: "POST" })
  public async login(req: Request, res: Response) {
    const mail = getRequiredParameter(req, "mail");
    const password = getRequiredParameter(req, "password");

    const user = await this.userService.findByMail(mail);
    if (!user || !(await this.userService.isValidPassword(user, password))) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    await this.sessionService.startSession(user, res);

    return {};
  }

  @Route({ method: "POST" })
  public async logout(req: Request, res: Response) {
    if (!req.session) {
      throw new Error("Logic error: Session not found.");
    }
    await this.sessionService.closeSession(req.session, res);

    return {};
  }
}
