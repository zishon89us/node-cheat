import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../app/models/user.js';
import { facebookAuth, twitterAuth } from './auth.js';

const splitLocation = (value = '') => {
  const [city = '', state = ''] = value.split(',').map((part) => part.trim());
  return state ? { city, state } : { city: '', state: city };
};

// Twitter does not expose gender; guess it from the first name (best effort, never blocks login)
const guessGender = async (firstName) => {
  if (!firstName) return 'Not Provided';
  try {
    const url = new URL('https://api.genderize.io/');
    url.searchParams.set('name', firstName);
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const { gender } = res.ok ? await res.json() : {};
    return gender ?? 'Not Provided';
  } catch {
    return 'Not Provided';
  }
};

const upsertSocialUser = (provider, id, token, fields) =>
  User.findOneAndUpdate(
    { 'social.provider': provider, 'social.id': id },
    { $set: { ...fields, 'social.provider': provider, 'social.id': id, 'social.token': token } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

// passport strategies still use callbacks; bridge them to async functions
const asyncVerify = (fn) => (token, tokenSecret, profile, done) => {
  fn(token, profile).then((user) => done(null, user), done);
};

export default function configurePassport(passport) {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => done(null, user ?? false), done);
  });

  if (facebookAuth) {
    passport.use(
      new FacebookStrategy(
        { ...facebookAuth, profileFields: ['id', 'emails', 'name', 'birthday', 'gender', 'location', 'age_range'] },
        asyncVerify(async (token, profile) => {
          const json = profile._json;
          return upsertSocialUser('facebook', profile.id, token, {
            firstName: json.first_name,
            lastName: json.last_name,
            birthday: json.birthday,
            ageRange: json.age_range?.min,
            gender: json.gender ?? 'Not Provided',
            email: json.email ?? 'Not Provided',
            location: splitLocation(json.location?.name),
          });
        }),
      ),
    );
  }

  if (twitterAuth) {
    passport.use(
      new TwitterStrategy(
        { ...twitterAuth, includeEmail: true },
        asyncVerify(async (token, profile) => {
          const [firstName = '', ...rest] = (profile._json.name ?? profile.displayName ?? '').split(' ');
          return upsertSocialUser('twitter', profile.id, token, {
            firstName,
            lastName: rest.at(-1) ?? '',
            gender: await guessGender(firstName),
            email: profile.emails?.[0]?.value ?? 'Not Provided',
            location: splitLocation(profile._json.location),
          });
        }),
      ),
    );
  }
}
