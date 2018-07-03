import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/User';

passport.use(new LocalStrategy({
  usernameField: 'courriel',
  passwordField: 'password',
}, ((username, password, done) => {
    User.findOne({ courriel: username }).then((user, err) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'user not found',
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'wrong password',
        });
      }
      return done(null, user);
    });
  })));
