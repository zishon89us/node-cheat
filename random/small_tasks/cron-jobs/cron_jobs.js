//------------------------------------------------------
// Schedule recurring jobs with node-cron
// Web Link=> https://nodecron.com
// Run: node cron_jobs.js
//------------------------------------------------------

import cron from 'node-cron';
import chalk from 'chalk';

const log = (msg, color = 'blue') => console.log(chalk[color](msg), chalk.green(new Date().toISOString()));

log('Starting now');

// minute hour day-of-month month day-of-week (optional leading seconds field)

// Every hour, on the hour: 5:00, 6:00, 7:00 ...
cron.schedule('0 * * * *', () => log('Every hour', 'red'));

// At minute 30 of every hour: 5:30, 6:30, 7:30 ...
cron.schedule('30 * * * *', () => log('At minute 30', 'green'));

// Every half hour: 5:00, 5:30, 6:00 ...
cron.schedule('*/30 * * * *', () => log('Every 30 minutes', 'blue'));

// Every 15 minutes: 5:00, 5:15, 5:30 ...
cron.schedule('*/15 * * * *', () => log('Every 15 minutes', 'yellow'));

// Every 2 minutes: 5:00, 5:02, 5:04 ...
cron.schedule('*/2 * * * *', () => log('Every 2 minutes', 'magenta'));

// Every 10 seconds (6-field expression)
const everyTenSeconds = cron.schedule('*/10 * * * * *', () => log('Every 10 seconds', 'cyan'));

// Tasks can be paused and resumed
setTimeout(() => {
  everyTenSeconds.stop();
  log('Stopped the 10-second task', 'gray');
}, 60_000);
