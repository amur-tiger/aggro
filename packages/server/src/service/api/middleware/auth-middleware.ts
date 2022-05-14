import { RequestHandler } from "express";
import { Logger } from "../../logger";
import { SessionService } from "../../session/session-service";
import { ForbiddenException } from "../exceptions/forbidden-exception";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";

const logger = new Logger(authMiddleware);

export function authMiddleware(
  sessionService: SessionService,
  isPublic: boolean,
  pattern: string
): RequestHandler {
  return (req, res, next) => {
    if (isPublic) {
      logger.debug(`Allowing access to ${pattern} (is public)`);
      next();
      return;
    }

    const token = req.cookies.token;
    if (!token) {
      logger.debug(`Denying access to ${pattern}`);
      return next(new UnauthorizedException("Token is missing"));
    }

    sessionService
      .findSession(req.cookies.token, { loadUser: true })
      .then((session) => {
        if (!session) {
          logger.debug(`Denying access to ${pattern}`);
          return next(new ForbiddenException("Token is invalid"));
        }
        sessionService
          .touch(session, res)
          .then(() => {
            req.session = session;
            logger.debug(`Allowing access to ${pattern} (user authenticated)`);
            next();
          })
          .catch(next);
      })
      .catch(next);
  };
}
