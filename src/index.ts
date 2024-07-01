import "reflect-metadata";
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from "type-graphql";
import { CountryResolver } from "./resolvers/Country.resolver";
import datasource from "./lib/datasource";
import { ContinentResolver } from "./resolvers/Continent.resolver";

const app = express();
const httpServer = http.createServer(app);

const main = async () => {
  const schema = await buildSchema({
    resolvers: [CountryResolver, ContinentResolver]
  });
  const server = new ApolloServer<{}>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  app.use(
    '/',
    cors<cors.CorsRequest>({
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server),
  );
  await datasource.initialize();
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

main();