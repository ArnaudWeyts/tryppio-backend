import * as mongoose from 'mongoose';

/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */
const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the user when we use it.
 */
tripSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 */
tripSchema.method('toGraph', function toGraph(this: any) {
  const json = JSON.parse(JSON.stringify(this));
  return { id: json._id, ...json };
});

/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('Trip', tripSchema);
