import { join } from "path";
import "reflect-metadata";
import Express from "express";
import cookieParser from "cookie-parser";
import { Container } from "typedi";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { initContainer } from "./container";
import { Logger } from "./service/logger";
import { UserService } from "./service/user/user-service";
import { Cursor } from "./resolver/pagination/cursor";
import { CursorScalar } from "./resolver/pagination/cursor-scalar";
import { FeedResolver } from "./resolver/feed/feed-resolver";
import { ApiService } from "./service/api/api-service";
import { LoginController } from "./api/login-controller";
import { authMiddleware } from "./service/api/middleware/auth-middleware";
import { SessionService } from "./service/session/session-service";
import { exceptionHandler } from "./service/api/middleware/exception-handler";

async function main() {
  const logger = new Logger("main");
  logger.info("Initializing");

  await initContainer();

  const userService = Container.get(UserService);
  await userService.initAdminAccountIfNecessary();

  logger.info("Building GraphQL Schema");
  const schema = await buildSchema({
    scalarsMap: [
      {
        type: Cursor,
        scalar: CursorScalar,
      },
    ],
    resolvers: [FeedResolver],
    container: Container,
    emitSchemaFile: true,
  });

  const app = Express();
  app.use(cookieParser());
  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
  app.use(Express.static(join(__dirname, "../../frontend/public")));

  const apiService = Container.get(ApiService);
  apiService.addController(LoginController);
  apiService.applyMiddleware(app, "/api");

  const gqlServer = new ApolloServer({
    schema,
  });

  logger.info("Starting Server");
  await gqlServer.start();

  const path = "/graphql";
  app.use(path, authMiddleware(Container.get(SessionService), false, path));
  gqlServer.applyMiddleware({ app, path });

  app.use(exceptionHandler());

  const port = Container.get<number>("port");
  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}/`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
