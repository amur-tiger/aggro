import { join } from "path";
import "reflect-metadata";
import Express from "express";
import compression from "compression-next";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { initContainer } from "./container";
import { Logger } from "./core/logger";
import { MigrationsService } from "./core/migrations";
import { UserRepository, UserService } from "./domains/user";
import { ApiService, authMiddleware, Cursor, CursorScalar, exceptionHandler } from "./core/api";
import { LoginController, SessionService } from "./domains/session";
import { SourceResolver } from "./domains/source";

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
    resolvers: [SourceResolver],
    container,
    emitSchemaFile: true,
  });

  const app = Express();
  app.use(compression());
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
  app.use(path, authMiddleware(container.get(SessionService), container.get(UserRepository), false, path));
  gqlServer.applyMiddleware({ app, path });

  app.use("*", (_, res) => {
    res.sendFile(join(__dirname, "../../frontend/public/index.html"));
  });
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
