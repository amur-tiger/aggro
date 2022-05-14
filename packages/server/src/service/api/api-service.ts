import { Container, Service } from "typedi";
import { Express } from "express";
import { Logger } from "../logger";
import { Method, Route } from "./decorators/route";
import { authMiddleware } from "./middleware/auth-middleware";
import { SessionService } from "../session/session-service";
import { Public } from "./decorators/public";
import pkg from "../../../../../package.json";

export type ControllerClass = Function;

@Service()
export class ApiService {
  private readonly logger = new Logger(ApiService);
  private readonly controllers: ControllerClass[] = [];

  public constructor(private readonly sessionService: SessionService) {}

  public addController(...controllers: ControllerClass[]) {
    this.controllers.push(...controllers);
  }

  public applyMiddleware(app: Express, base: string) {
    for (const controller of this.controllers) {
      const metadata = Route.get(controller);
      if (!metadata) {
        throw new TypeError(`Class ${controller.name} is not a Controller.`);
      }

      for (const [funcName, { method, pattern }] of Object.entries(
        metadata.routes
      )) {
        let joinedPattern = base;
        if (!base.startsWith("/")) {
          joinedPattern = "/" + joinedPattern;
        }
        if (!pattern.startsWith("/") && !base.endsWith("/")) {
          joinedPattern += "/";
        }
        joinedPattern += pattern;

        app.use(
          joinedPattern,
          authMiddleware(
            this.sessionService,
            Public.isPublic(controller, funcName),
            joinedPattern
          )
        );
        this.registerRoute(app, controller, funcName, method, joinedPattern);
      }
    }
  }

  private registerRoute(
    app: Express,
    controller: ControllerClass,
    funcName: string,
    method: Method,
    pattern: string
  ) {
    const appMethodMap = {
      GET: "get",
      POST: "post",
      PUT: "put",
      DELETE: "delete",
    } as const;

    this.logger.info(
      `Registering ${controller.name}.${funcName}() as ${
        method ?? "GET"
      } ${pattern}`
    );

    app[appMethodMap[method]](pattern, async (req, res, next) => {
      try {
        this.logger.debug(`${method} ${pattern}`);
        res.header("X-Powered-By", `Aggro/${pkg.version}`);
        const ctr = Container.get<any>(controller);
        const data = await ctr[funcName](req, res);
        if (data != null) {
          res.json({
            data,
          });
        } else {
          res.status(204);
        }
        res.end();
      } catch (e) {
        next(e);
      }
    });
  }
}
