import Trip from './model';
import User from '../Users/model';

export default {
  Query: {
    async trips() {
      const trips: any[] = await Trip.find({}, null);
      return trips.map(trip => trip.toGraph());
    }
  },
  Mutation: {
    async addTrip(_, { input }, context) {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      input.user = context.user;
      const trip: any = await Trip.create(input);
      return trip.toGraph();
    }
  },
  Trip: {
    async user(trip) {
      if (trip.user) {
        const user: any = await User.findById(trip.user);
        return user.toGraph();
      }
      return null;
    }
  }
};
