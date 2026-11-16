const baseUrl = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const env = process.env;

// A provider is enabled only when both of its credentials are set
export const facebookAuth =
  env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET
    ? {
        clientID: env.FACEBOOK_APP_ID,
        clientSecret: env.FACEBOOK_APP_SECRET,
        callbackURL: `${baseUrl}/auth/facebook/callback`,
        // passport-facebook defaults to an old version; Facebook upgrades expired versions automatically
        ...(env.FACEBOOK_GRAPH_VERSION && { graphAPIVersion: env.FACEBOOK_GRAPH_VERSION }),
      }
    : null;

export const twitterAuth =
  env.TWITTER_CONSUMER_KEY && env.TWITTER_CONSUMER_SECRET
    ? {
        consumerKey: env.TWITTER_CONSUMER_KEY,
        consumerSecret: env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${baseUrl}/auth/twitter/callback`,
      }
    : null;

if (!facebookAuth && !twitterAuth) {
  throw new Error(
    'Set FACEBOOK_APP_ID/FACEBOOK_APP_SECRET and/or TWITTER_CONSUMER_KEY/TWITTER_CONSUMER_SECRET',
  );
}
