# Twitter-Handles

Log in with X (Twitter), point the app at a public Google Sheet of first and last names, and get back the best-matching X accounts as JSON.

## Run it

1. Start MongoDB locally, or set `MONGODB_URI`.
2. `npm install`
3. `cp .env.example .env`, then fill in:
   - `SESSION_SECRET`: generate one with `openssl rand -hex 32`
   - `TWITTER_CONSUMER_KEY` / `TWITTER_CONSUMER_SECRET`: from an X developer app with OAuth 1.0a enabled and the callback set to `http://localhost:3000/auth/twitter/callback`
   - `GOOGLE_API_KEY`: a Google Cloud API key with the Sheets API enabled
4. `npm run dev`, then open http://localhost:3000

## Notes

- Share the sheet as "anyone with the link can view". It needs `first` and `last` columns.
- Lookups use `GET /2/users/search`. Your X API access tier must include user search.
- The app processes at most 50 names per request, one at a time, to stay within rate limits.
