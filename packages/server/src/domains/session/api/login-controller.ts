import { Request, Response } from "express";
import { getRequiredParameter, UnauthorizedException } from "../../../core/api";
import { Public } from "../../../core/api/decorators/public";
import { Route } from "../../../core/api/decorators/route";
import { Service } from "../../../core/container";
import { UserService } from "../../user";
import { SessionService } from "../service/session-service";

interface UserData {
  isLoggedIn: boolean;
  message: string;
  session?: {
    created: Date;
  };
  user?: {
    id: string;
    lastlogin: Date | null;
    mail: string;
    registered: Date;
    username: string;
  };
}

@Service()
export class LoginController {
  public constructor(private readonly userService: UserService, private readonly sessionService: SessionService) {}

  @Public()
  @Route()
  public async me(req: Request): Promise<UserData> {
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
  public async login(req: Request, res: Response): Promise<UserData> {
    const mail = getRequiredParameter(req, "mail");
    const password = getRequiredParameter(req, "password");

    const user = await this.userService.tryLogin(mail, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const session = await this.sessionService.startSession(user, res);

    return {
      isLoggedIn: true,
      message: "Logged in",
      session: {
        created: session.created,
      },
      user: {
        id: user.id,
        username: user.username,
        mail: user.mail,
        registered: user.registered,
        lastlogin: user.lastlogin,
      },
    };
  }

  @Route({ method: "POST" })
  public async logout(req: Request, res: Response): Promise<UserData> {
    if (!req.session) {
      throw new Error("Logic error: Session not found.");
    }
    await this.sessionService.closeSession(req.session, res);

    return {
      isLoggedIn: false,
      message: "Unauthorized",
    };
  }
}
