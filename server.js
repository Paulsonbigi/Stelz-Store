const dotenv = require('dotenv');
const ConnectDB = require('./config/database');
const logger = require('./utils/logger');

// handling exception error
process.on('uncaughtException', (err) => {
    logger.info(`UNCAUGHTEXCEPTION: ${err.stack}`);
    process.exit(1)
})

dotenv.config({ path: './.env' });
const app = require('./app');

ConnectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});
process.on('uncaughtException', (err) => {
  // logger.error('There was an uncaught error', err.stack);
  console.log(err.stack);
  process.exit(1); //mandatory (as per the Node.js docs)
});


