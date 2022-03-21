import "reflect-metadata";
import Express from "express";
import { Container } from "typedi";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { FeedResolver } from "./resolver/feed/feed-resolver";
import { initContainer } from "./container";

async function main() {
  initContainer();

  const schema = await buildSchema({
    resolvers: [FeedResolver],
    container: Container,
    emitSchemaFile: true,
  });

  const app = Express();
  const server = new ApolloServer({
    schema,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000/graphql`);
  });
}

main().catch(console.error);
