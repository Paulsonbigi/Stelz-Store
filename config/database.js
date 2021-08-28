const mongoose = require('mongoose');
const logger = require('../utils/logger');

const conectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB, {
      useCreateIndex: true,
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.info(`connect to db on ${conn.connection.host}`);
  } catch (error) {
    logger.error(error.message);
  }
};
module.exports = conectDB;
