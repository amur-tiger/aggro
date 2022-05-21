import { RequestHandler } from "express";
import { Logger } from "../../logger";
import { SessionService } from "../../../domains/session/service/session-service";
import { UserRepository } from "../../../domains/user/repository/user-repository";
import { ForbiddenException } from "../exceptions/forbidden-exception";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";

const logger = new Logger(authMiddleware);

export function authMiddleware(
  sessionService: SessionService,
  userRepository: UserRepository,
  isPublic: boolean,
  pattern: string
): RequestHandler {
  return (req, res, next) => {
    (async () => {
      const token = req.cookies.token;
      req.session =
        (token && (await sessionService.findSession(token))) || undefined;
      req.user =
        (req.session &&
          (await userRepository.findOneBy("id", req.session.userid))) ||
        undefined;

      if (req.session && !req.user) {
        throw new TypeError("Logic Error: User not found.");
      }

      if (isPublic) {
        logger.debug(`Allowing access to ${pattern} (is public)`);
        return;
      }

      if (req.session) {
        await sessionService.touch(req.session, res);
        logger.debug(`Allowing access to ${pattern} (user authenticated)`);
        return;
      }

      logger.debug(`Denying access to ${pattern}`);
      if (token) {
        throw new ForbiddenException("Token is invalid");
      }
      throw new UnauthorizedException("Token is missing");
    })()
      .then(next)
      .catch(next);
  };
}
