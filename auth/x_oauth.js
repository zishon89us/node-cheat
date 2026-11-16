//------------------------------------------------------
// X (Twitter) API authentication modes with twitter-api-v2
// 1. App-only (OAuth 2.0 bearer token) for public, read-only data
// 2. User context (OAuth 1.0a) to act on behalf of an account
// Run: TWITTER_CONSUMER_KEY=... TWITTER_CONSUMER_SECRET=... node x_oauth.js
//------------------------------------------------------

import { TwitterApi } from 'twitter-api-v2';

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;
if (!TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET) {
  throw new Error('Set TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET');
}

// 1. App-only: exchanges key/secret for a bearer token (POST /oauth2/token)
const appClient = await new TwitterApi({
  appKey: TWITTER_CONSUMER_KEY,
  appSecret: TWITTER_CONSUMER_SECRET,
}).appLogin();

const { data: user } = await appClient.v2.userByUsername('shan89', {
  'user.fields': ['description', 'public_metrics'],
});
console.log('App-only lookup:', user);

// 2. User context: requires an access token/secret for a specific account
if (TWITTER_ACCESS_TOKEN && TWITTER_ACCESS_TOKEN_SECRET) {
  const userClient = new TwitterApi({
    appKey: TWITTER_CONSUMER_KEY,
    appSecret: TWITTER_CONSUMER_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
  });
  const { data: me } = await userClient.v2.me();
  console.log('Authenticated as:', me.username);
}
