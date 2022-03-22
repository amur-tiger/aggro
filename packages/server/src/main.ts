import "reflect-metadata";
import Express from "express";
import { Container } from "typedi";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Logger } from "./service/logger";
import { Cursor } from "./resolver/pagination/Cursor";
import { CursorScalar } from "./resolver/pagination/CursorScalar";
import { FeedResolver } from "./resolver/feed/feed-resolver";
import { initContainer } from "./container";

async function main() {
  const logger = new Logger("main");
  logger.info("Initializing");

  await initContainer();

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
  const server = new ApolloServer({
    schema,
  });

  logger.info("Starting Server");
  await server.start();
  server.applyMiddleware({ app });

  const port = Container.get<number>("port");
  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}/graphql`);
  });
}

main().catch(console.error);
