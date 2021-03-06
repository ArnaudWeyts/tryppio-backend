import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

/**
 * Here is the our user schema which will be used to
 * validate the data sent to our database.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

/**
 * This property will ensure our virtuals (including "id")
 * are set on the user when we use it.
 */
userSchema.set('toObject', { virtuals: true });

/**
 * This is a helper method which converts mongoose properties
 * from objects to strings, numbers, and booleans.
 */
userSchema.method('toGraph', function toGraph(this: any) {
  const json = JSON.parse(JSON.stringify(this));
  return { id: json._id, ...json };
});

userSchema.pre('save', function save(this: any, next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

userSchema.method('comparePassword', function comparePassword(
  this: any,
  candidate: string
) {
  return bcrypt.compare(candidate, this.password);
});

/**
 * Finally, we compile the schema into a model which we then
 * export to be used by our GraphQL resolvers.
 */
export default mongoose.model('User', userSchema);
