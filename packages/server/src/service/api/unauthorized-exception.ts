import { HttpException } from "./http-exception";

export class UnauthorizedException extends HttpException {
  public readonly status = 401;
}
