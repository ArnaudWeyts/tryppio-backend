import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import * as mongoose from 'mongoose';

import * as userSchema from './Domain/Users/user.schema.gql';
import * as rootSchema from './Domain/root.schema.gql';

/**
 * Connect to the mongodb database using the mongoose library.
 */
mongoose.connect(
  // you can use 'mongodb://localhost/graphql-demo' in development
  `mongodb://${process.env.MONGODB_DB}`,
  {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

/**
 * Declare the schema which the will hold our GraphQL types and
 * resolvers.
 */
const schema = makeExecutableSchema({
  typeDefs: [rootSchema, userSchema],
  typeDefs: [rootTypeDefs]
});

/**
 * Create the server which we will send our GraphQL queries to.
 */
const server = new ApolloServer({
  schema,
  formatError(error) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // log errors in development
      console.log(error);
    }
    return error;
  }
});

/**
 * Turn the server on by listening to a port.
 * Defaults to: http://localhost:4000
 */
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
