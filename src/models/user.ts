import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDoc extends Document {
  username: string;
  password: string;
  name: string;
  email: string;
  googleId: string;
  facebookId: string;
}

export interface UserModel extends Model<UserDoc> {
  createSecure(username: string, password: string, name: string, email: string): Promise<UserDoc>;
  authenticate(username: string, password: string): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    username: { type: String, unique: true },
    password: String,
    name: String,
    email: { type: String, unique: true },
    googleId: { type: String, unique: true },
    facebookId: { type: String, unique: true },
  },
  { timestamps: true }
);

userSchema.statics.createSecure = async function (
  username: string,
  password: string,
  name: string,
  email: string
) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = new this({
    username,
    password: hash,
    name,
    email,
  });
  await user.save();
  return user;
};

userSchema.statics.authenticate = async function (username: string, password: string) {
  const user = await this.findOne({ username });
  if (!user) {
    return null;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }
  return user;
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
