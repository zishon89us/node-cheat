import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { join } from 'node:path';
import dashboardRoute from './routes/admin/dashboard.js';
import postsRoute from './routes/front-end/posts.js';

const { MONGO_URI, PORT = 8080 } = process.env;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Copy .env.example to .env and run `npm start`.');
  process.exit(1);
}

const app = express();

app.set('views', join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'default/layout');
app.locals.website_name = 'XPressBlog';

app.use(morgan('dev'));
app.use(express.static(join(import.meta.dirname, 'public')));
app.use(expressLayouts);

app.use('/dashboard', dashboardRoute);
app.use('/', postsRoute);

app.use((req, res) => res.status(404).send('Not found'));

// Express 5 forwards rejected promises from async handlers here
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

// Connect first, then listen: requests never hang waiting on the database
await mongoose.connect(MONGO_URI);
mongoose.connection.on('error', (err) => console.error(`DB connection error: ${err.message}`));

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
