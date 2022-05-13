import { HttpException } from "./http-exception";

export class ForbiddenException extends HttpException {
  public readonly status = 403;
}
