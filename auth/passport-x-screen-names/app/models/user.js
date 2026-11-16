import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    twitterId: { type: String, unique: true },
    // OAuth 1.0a user credentials; excluded from queries unless selected explicitly
    token: { type: String, select: false },
    tokenSecret: { type: String, select: false },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
