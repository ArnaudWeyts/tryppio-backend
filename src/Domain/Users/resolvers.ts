import * as jwt from 'jsonwebtoken';

import User from './model';
import { Trip } from '../Trips';

/**
 * Exporting our resolver functions. Note that:
 * 1. They can use async/await or return a Promise which
 *    Apollo will resolve for us.
 * 2. The resolver property names match exactly with the
 *    schema types.
 */
export default {
  Query: {
    users: async (_, { filter = {} }) => {
      const users: any[] = await User.find({}, null, filter);
      // notice that I have ": any[]" after the "users" variable?
      // That is because I am using TypeScript but you can remove
      // this and it will work normally with pure JavaScript
      return users.map(user => user.toGraph());
    },
    user: async (_, { id }) => {
      const user: any = await User.findById(id);
      return user.toGraph();
    }
  },
  Mutation: {
    addUser: async (_, { input }) => {
      const user: any = await User.create(input);
      return user.toGraph();
    },
    editUser: async (_, { id, input }) => {
      const user: any = await User.findByIdAndUpdate(id, input);
      return user.toGraph();
    },
    deleteUser: async (_, { id }) => {
      const user: any = await User.findByIdAndRemove(id);
      return user ? user.toGraph() : null;
    },
    loginUser: async (_, { email, password }) => {
      const user: any = await User.findOne({ email });
      const match: boolean = await user.comparePassword(password);
      if (match) {
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      }
      throw new Error('Not Authorized.');
    }
  },
  User: {
    async trips(user: { id: string }) {
      if (user.id) {
        const trips: any = await Trip.find({ user: user.id });
        return trips.map(trip => trip.toGraph());
      }
      return null;
    }
  }
};
