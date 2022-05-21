import { HttpException } from "./http-exception";

export class BadRequestException extends HttpException {
  public readonly status = 400;
}
