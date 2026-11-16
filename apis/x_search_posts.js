//------------------------------------------------------
// Post a tweet and search recent tweets with the X (Twitter) API v2
// Web Link=> https://github.com/PLhery/node-twitter-api-v2
// Run: TWITTER_CONSUMER_KEY=... TWITTER_CONSUMER_SECRET=... TWITTER_ACCESS_TOKEN=... TWITTER_ACCESS_TOKEN_SECRET=... node x_search_posts.js
//------------------------------------------------------

import { TwitterApi } from 'twitter-api-v2';

const required = [
  'TWITTER_CONSUMER_KEY',
  'TWITTER_CONSUMER_SECRET',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_TOKEN_SECRET',
];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);

// OAuth 1.0a user context: acts as the account that owns the access token
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const { data: tweet } = await client.v2.tweet('hello world!');
console.log('Posted:', tweet.id);

// Recent search covers the last 7 days; full-archive search needs a higher API tier
const results = await client.v2.search('banana -is:retweet', { max_results: 100 });
for (const t of results.tweets) console.log(t.id, t.text);
