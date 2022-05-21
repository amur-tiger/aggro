import { join } from "path";
import "reflect-metadata";
import Express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { initContainer } from "./container";
import { Logger } from "./core/logger";
import { UserService } from "./domains/user/service/user-service";
import { Cursor } from "./core/api/pagination/cursor";
import { CursorScalar } from "./core/api/pagination/cursor-scalar";
import { ApiService } from "./core/api/api-service";
import { LoginController } from "./domains/session/api/login-controller";
import { authMiddleware } from "./core/api/middleware/auth-middleware";
import { SessionService } from "./domains/session/service/session-service";
import { exceptionHandler } from "./core/api/middleware/exception-handler";
import { MigrationsService } from "./core/migrations/migrations-service";
import { SourcesResolver } from "./_sources/sources/sources-resolver";
import { UserRepository } from "./domains/user/repository/user-repository";

const logger = new Logger("main");

async function main() {
  logger.info("Initializing");

  const container = await initContainer();

  const migrationsService = container.get(MigrationsService);
  await migrationsService.init();

  const userService = container.get(UserService);
  await userService.initAdminAccountIfNecessary();

  logger.info("Building GraphQL Schema");
  const schema = await buildSchema({
    scalarsMap: [
      {
        type: Cursor,
        scalar: CursorScalar,
      },
    ],
    resolvers: [SourcesResolver],
    container,
    emitSchemaFile: true,
  });

  const app = Express();
  app.use(cookieParser());
  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
  app.use(Express.static(join(__dirname, "../../frontend/public")));

  const apiService = container.get(ApiService);
  apiService.addController(LoginController);
  apiService.applyMiddleware(app, "/api");

  const gqlServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      session: req.session,
      user: req.user,
    }),
  });

  logger.info("Starting Server");
  await gqlServer.start();

  const path = "/graphql";
  app.use(
    path,
    authMiddleware(
      container.get(SessionService),
      container.get(UserRepository),
      false,
      path
    )
  );
  gqlServer.applyMiddleware({ app, path });

  app.use(exceptionHandler());

  const port = container.get<number>("port");
  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}/`);
  });
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
