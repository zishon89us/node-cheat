//------------------------------------------------------
// Read first/last names from a public Google Sheet and look up matching X (Twitter) accounts
//------------------------------------------------------

import { TwitterApi } from 'twitter-api-v2';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import User from '../models/user.js';
import { twitterAuth, googleApiKey } from '../../config/auth.js';

const SHEET_ID = /^[\w-]{20,100}$/;
const MAX_NAMES = 50;

const readNames = async (sheetId) => {
  const doc = new GoogleSpreadsheet(sheetId, { apiKey: googleApiKey });
  await doc.loadInfo();
  const rows = await doc.sheetsByIndex[0].getRows({ limit: MAX_NAMES });
  return rows
    .map((row) => `${row.get('first') ?? ''} ${row.get('last') ?? ''}`.trim())
    .filter(Boolean);
};

export const usernames = async (req, res) => {
  const sheetId = String(req.query.sheet ?? '');
  if (!SHEET_ID.test(sheetId)) return res.status(400).json({ error: 'Invalid spreadsheet id' });

  const { token, tokenSecret } = await User.findById(req.user.id).select('+token +tokenSecret');
  if (!token) return res.redirect('/auth/twitter');

  const client = new TwitterApi({
    appKey: twitterAuth.consumerKey,
    appSecret: twitterAuth.consumerSecret,
    accessToken: token,
    accessSecret: tokenSecret,
  });

  const names = await readNames(sheetId);

  // Sequential on purpose: the user-search endpoint has a low rate limit
  const results = [];
  for (const name of names) {
    const page = await client.v2.searchUsers(name);
    const match = page.data.data?.[0];
    results.push(
      match ? { name: match.name, screen_name: match.username } : { name, screen_name: null },
    );
  }

  res.json(results);
};
