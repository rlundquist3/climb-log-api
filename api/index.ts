import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer, gql } from 'apollo-server-express';
import neo4j from 'neo4j-driver';
import express from 'express';
import cors from 'cors';
import http from 'http';

import { climbTypes } from './climb';

const { AURA_ENDPOINT, USERNAME, PASSWORD } = process.env;

const driver = neo4j.driver(
  AURA_ENDPOINT as string,
  neo4j.auth.basic(USERNAME as string, PASSWORD as string)
);

const typeDefs = gql`
  ${climbTypes}
`;

const neo4jGraphQL = new Neo4jGraphQL({
  typeDefs,
  driver,
});

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

const startApolloServer = async (app, httpServer) => {
  // Generate schema
  const schema = await neo4jGraphQL.getSchema();

  // Create ApolloServer instance to serve GraphQL schema
  const server = new ApolloServer({
    schema,
    context: { driverConfig: { database: 'neo4j' } },
  });

  await server.start();
  server.applyMiddleware({ app });
};

startApolloServer(app, httpServer);

export default httpServer;
