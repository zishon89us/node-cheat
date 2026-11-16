import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const app = express();
const isDev = app.get('env') === 'development';

app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'pug');
app.disable('x-powered-by');

app.use(logger(isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// Stack traces are rendered only in development
app.use((err, req, res, _next) => {
  res.locals.message = err.expose ? err.message : 'Something went wrong';
  res.locals.error = isDev ? err : {};
  res.status(err.status ?? 500);
  res.render('error');
});

export default app;
