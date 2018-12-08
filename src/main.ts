import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';

import { userSchema, userResolvers, User } from './Domain/Users';
import { tripSchema, tripResolvers } from './Domain/Trips';

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
  typeDefs: [rootSchema, userSchema, tripSchema],
  resolvers: [userResolvers, tripResolvers]
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
  },
  async context({ req }) {
    const token = req && req.headers && req.headers.authorization;
    if (token) {
      const data: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = data.id ? await User.findById(data.id) : null;
      return { user };
    }
  }
});

/**
 * Turn the server on by listening to a port.
 * Defaults to: http://localhost:4000
 */
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
