import createError from 'http-errors';
import passport from 'passport';

import User from '../models/User';

const authController = {};

authController.register = ((req, res, next) => {
  req.checkBody('username').notEmpty();
  req.checkBody('courriel').notEmpty().isEmail();
  req.checkBody('password').notEmpty();

  if (req.validationErrors()) {
    next(createError(422, 'invalid data'));
  } else {
    const newUser = new User();
    newUser.username = req.body.username;
    newUser.courriel = req.body.courriel;
    newUser.setPassword(req.body.password);

    newUser.save().then((user) => {
      const token = user.generateJwt();
      res.status(200).json({
        token,
      });
    }).catch((err) => {
      if (err.name === 'MongoError') {
        if (err.code === 11000) {
          if ((err.message).includes('username')) {
            next(createError(409, 'username already used'));
          } else {
            next(createError(409, 'courriel already used'));
          }
        }
      } else {
        next(createError(err.status || 500, err.message));
      }
    });
  }
});


authController.login = ((req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    let token;
    if (err) {
      next(createError(404, err.message));
    }
    if (user) {
      token = user.generateJwt();
      res.status(200).json({ token });
    } else {
      next(createError(401, info));
    }
  })(req, res, next);
});

export default authController;
