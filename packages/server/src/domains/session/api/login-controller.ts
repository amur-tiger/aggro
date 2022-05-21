import { Request, Response } from "express";
import { Route } from "../../../core/api/decorators/route";
import { Public } from "../../../core/api/decorators/public";
import { SessionService } from "../service/session-service";
import { UserService } from "../../user/service/user-service";
import { getRequiredParameter } from "../../../core/api/utils";
import { UnauthorizedException } from "../../../core/api/exceptions/unauthorized-exception";
import { Service } from "../../../core/container/decorators/service";

@Service()
export class LoginController {
  public constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  @Public()
  @Route()
  public async me(req: Request) {
    if (!req.session || !req.user) {
      return {
        isLoggedIn: false,
        message: "Unauthorized",
      };
    }

    return {
      isLoggedIn: true,
      message: "Logged in",
      session: {
        created: req.session.created,
      },
      user: {
        id: req.user.id,
        username: req.user.username,
        mail: req.user.mail,
        registered: req.user.registered,
        lastlogin: req.user.lastlogin,
      },
    };
  }

  @Public()
  @Route({ method: "POST" })
  public async login(req: Request, res: Response) {
    const mail = getRequiredParameter(req, "mail");
    const password = getRequiredParameter(req, "password");

    const user = await this.userService.tryLogin(mail, password);
    if (!user) {
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
