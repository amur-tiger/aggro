import { ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/http-exception";
import { Logger } from "../../logger";

const logger = new Logger(exceptionHandler);

export function exceptionHandler(): ErrorRequestHandler {
  return (err, _req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    const [status, message] =
      err instanceof HttpException
        ? [err.status, err.message]
        : [500, "Internal Server Error"];

    if (err instanceof Error && err.stack) {
      logger.error(err.stack);
    } else {
      logger.error(`Error ${status}: ${message}`);
    }

    res.status(status);
    res.json({
      errors: [
        {
          message,
          code: status,
        },
      ],
    });
  };
}
