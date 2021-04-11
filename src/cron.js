const { autoUnban } = require("./db");
const cron = require('node-cron');
const startCron = () => {
    cron.schedule("*/5 * * * *", autoUnban)
}

module.exports = startCron;