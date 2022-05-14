export abstract class HttpException extends Error {
  public abstract readonly status: number;
}
