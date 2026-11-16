const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, GOOGLE_API_KEY } = process.env;
const baseUrl = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

const missing = Object.entries({ TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, GOOGLE_API_KEY })
  .filter(([, value]) => !value)
  .map(([name]) => name);
if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);

export const twitterAuth = {
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: `${baseUrl}/auth/twitter/callback`,
};

export const googleApiKey = GOOGLE_API_KEY;
