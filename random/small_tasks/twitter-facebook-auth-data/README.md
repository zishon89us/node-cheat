# Node-Social

Facebook and X (Twitter) login with Passport 0.7, Express 5 and Mongoose 9. Sessions are stored in MongoDB.

## Run it

1. Start MongoDB locally, or point `MONGODB_URI` at a hosted cluster.
2. `npm install`
3. `cp .env.example .env`, then set `SESSION_SECRET` (`openssl rand -hex 32`) and the credentials for at least one provider.
   - Facebook: create an app at https://developers.facebook.com/apps/ and add `http://localhost:3000/auth/facebook/callback` as a valid OAuth redirect URI.
   - X: create an app at https://developer.x.com, enable OAuth 1.0a, and set the callback to `http://localhost:3000/auth/twitter/callback`. To receive email, also enable "Request email from users".
4. `npm run dev`
5. Open http://localhost:3000

## What it stores

For both providers it stores: id, first name, last name, email, gender and location. For Facebook it also stores birthday and age range.

- X does not expose gender or age. The app guesses gender from the first name using [genderize.io](https://genderize.io).
- Facebook only returns `user_birthday` and `user_location` after your app passes App Review.

## Useful links

- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Passport docs](https://www.passportjs.org/docs/)
