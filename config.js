const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  mattermostWebHookUrl: process.env.MM_WEBHOOK_URL,
};
