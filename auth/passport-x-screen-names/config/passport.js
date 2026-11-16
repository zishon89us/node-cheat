import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../app/models/user.js';
import { twitterAuth } from './auth.js';

export default function configurePassport(passport) {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => done(null, user ?? false), done);
  });

  passport.use(
    new TwitterStrategy(twitterAuth, (token, tokenSecret, profile, done) => {
      User.findOneAndUpdate(
        { twitterId: profile.id },
        { $set: { name: profile.displayName, token, tokenSecret } },
        { upsert: true, returnDocument: 'after' },
      ).then((user) => done(null, user), done);
    }),
  );
}
