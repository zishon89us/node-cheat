import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    birthday: String,
    ageRange: Number,
    firstName: String,
    lastName: String,
    gender: String,
    locale: String,
    email: String,
    location: {
      city: String,
      state: String,
    },
    social: {
      id: { type: String, index: true }, // Facebook or Twitter user id
      provider: String, // 'facebook' | 'twitter'
      token: { type: String, select: false }, // never sent to views unless explicitly selected
    },
  },
  { timestamps: true },
);

userSchema.index({ 'social.provider': 1, 'social.id': 1 }, { unique: true });

export default mongoose.model('User', userSchema);
