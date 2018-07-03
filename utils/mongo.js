import mongoose from 'mongoose';
import MongooseConnectionConfig from 'mongoose-connection-config';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const options = {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectOptions: {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
  },
};

const connectionConfig = new MongooseConnectionConfig(options);

mongoose.Promise = global.Promise;

const mongoConnect = (() => {
  mongoose.connect(connectionConfig.getMongoUri())
    .then(() => {
      logger.info('Successfully connected to MongoDB');
    }).catch((err) => {
      logger.error(`Can't connect to MongoDB, reason : ${err}`);
    });
});

export default mongoConnect;
