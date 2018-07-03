import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class User extends mongoose.Schema {
  constructor() {
    const user = super({
      username: {
        type: String,
        unique: true,
        required: true,
      },
      courriel: {
        type: String,
        unique: true,
        required: true,
      },
      hash: String,
      salt: String,
    }, { versionKey: false });
    user.methods.setPassword = this.setPassword;
    user.methods.validPassword = this.validPassword;
    user.methods.generateJwt = this.generateJwt;
  }

  setPassword(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  }

  validPassword(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  }

  generateJwt() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
      /* eslint no-underscore-dangle: 'off' */
      _id: this._id,
      name: this.courriel,
      exp: parseInt(expiry.getTime() / 1000, 10),
    }, process.env.JWT_SECRET);
  }
}

export default mongoose.model('Users', new User());
