import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import validator from 'express-validator';
import path from 'path';
import favicon from 'serve-favicon';
import fs from 'fs';
import compression from 'compression';
import helmet from 'helmet';

import routes from './routes';
import mongoConnect from './utils/mongo';
import './utils/passport';

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('env', 'production');
  app.use(compression());
  app.use(helmet());
}

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));

app.use(
  app.get('env') === 'development'
    ? logger('dev')
    : logger('combined', {
      stream: fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' }),
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use(passport.initialize());
app.use(routes);

mongoConnect();

app.get('*.js', (req, res, next) => {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/javascript');
  next();
});

app.use((req, res, next) => {
  next(createError(404));
});

/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
