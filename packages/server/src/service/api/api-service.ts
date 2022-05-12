import { Container, Service } from "typedi";
import { Express, Response } from "express";
import { Route } from "./route";
import { Logger } from "../logger";
import { HttpException } from "./http-exception";
import pkg from "../../../../../package.json";

export type ControllerClass = Function;

@Service()
export class ApiService {
  private readonly logger = new Logger(ApiService);
  private readonly controllers: ControllerClass[] = [];

  public addController(...controllers: ControllerClass[]) {
    this.controllers.push(...controllers);
  }

  public applyMiddleware(app: Express, base: string) {
    const appMethodMap = {
      GET: "get",
      POST: "post",
      PUT: "put",
      DELETE: "delete",
    } as const;

    for (const controller of this.controllers) {
      const metadata = Route.get(controller);
      if (!metadata) {
        throw new TypeError(`Class ${controller.name} is not a Controller.`);
      }

      for (const [funcName, { method, pattern }] of Object.entries(
        metadata.routes
      )) {
        this.logger.info(
          `Registering ${controller.name}.${funcName}() as ${
            method ?? "GET"
          } ${base}${pattern}`
        );

        app[appMethodMap[method]](base + pattern, (req, res) => {
          this.logger.debug(`${method} ${base}${pattern}`);

          const ctr = Container.get<any>(controller);
          try {
            res.header("X-Powered-By", `Aggro/${pkg.version}`);
            const result = ctr[funcName](req, res);
            if (result.then) {
              result.then(this.handleResult(res)).catch(this.handleError(res));
            } else {
              this.handleResult(res, result);
            }
          } catch (e) {
            this.handleError(res, e);
          }
        });
      }
    }
  }

  private handleResult(res: Response): (data: any) => void;
  private handleResult(res: Response, data: any): void;

  private handleResult(
    res: Response,
    ...dataArr: any[]
  ): void | ((data: any) => void) {
    const handler = (data: any) => {
      if (data != null) {
        res.json({
          data,
        });
      }
      res.end();
    };

    if (dataArr.length > 0) {
      handler(dataArr[0]);
    } else {
      return handler;
    }
  }

  private handleError(res: Response): (err: any) => void;
  private handleError(res: Response, err: any): void;

  private handleError(
    res: Response,
    ...errArr: any[]
  ): void | ((err: any) => void) {
    const handler = (err: any) => {
      const [status, message] =
        err instanceof HttpException
          ? [err.status, err.message]
          : [500, "Internal Server Error"];
      if (err instanceof Error && err.stack) {
        this.logger.error(err.stack);
      } else {
        this.logger.error(`Error ${status}: ${message}`);
      }
      res.status(status);
      res.json({
        error: {
          code: status,
          message,
        },
      });
      res.end();
    };

    if (errArr.length > 0) {
      handler(errArr[0]);
    } else {
      return handler;
    }
  }
}
