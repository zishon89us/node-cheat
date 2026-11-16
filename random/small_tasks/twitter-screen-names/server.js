//------------------------------------------------------
// X (Twitter) login with Passport + Google Sheet name lookup
// Read README.md
//------------------------------------------------------

import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'node:path';

import { mongoUrl } from './config/database.js';
import configurePassport from './config/passport.js';
import routes from './app/routes.js';

const { SESSION_SECRET, NODE_ENV } = process.env;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error('Set SESSION_SECRET to a random string of at least 32 chars, e.g. $(openssl rand -hex 32)');
}

const port = Number(process.env.PORT ?? 3000);
const isProduction = NODE_ENV === 'production';

await mongoose.connect(mongoUrl);
configurePassport(passport);

const app = express();
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));
if (isProduction) app.set('trust proxy', 1);

app.use(logger(isProduction ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    cookie: { httpOnly: true, sameSite: 'lax', secure: isProduction, maxAge: 7 * 24 * 60 * 60 * 1000 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
