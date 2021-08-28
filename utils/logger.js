const winston = require("winston")
require('dotenv').config()

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
  });

/**
 * Console logger used throughout the app
 * @exports
 */
module.exports = {
    /**
     * @param {*} data - the data to be logged
     * @returns {void}
     */
    info(data) {
      winstonLogger.info(data);
    },
    /**
     * @param {*} data - the data to be logged
     * @returns {void}
     */
    error(data) {
      winstonLogger.info(data);
    },
  };
  