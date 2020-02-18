
//------------------------------------------------------
//Redis Connection - it will re-try until success or defined limit exceeded
//Web Link=> https://stackoverflow.com/questions/9940873/node-js-redis-client-connection-retry
//Run : node connect-retry.js
//------------------------------------------------------

const redis = require('redis');
const log = (type, fn) => fn ? () => {
	console.log(`connection ${type}`);
} : console.log(`connection ${type}`);

// Option 1: One connection is enough per application
const client = redis.createClient('6379', "localhost", {
	retry_strategy: (options) => {
		const {error, total_retry_time, attempt} = options;
		if (error && error.code === "ECONNREFUSED") {
			log(error.code); // take actions or throw exception
		}
		if (total_retry_time > 1000 * 15) { //in ms i.e. 15 sec
			log('Retry time exhausted'); // take actions or throw exception
		}
		if (options.attempt > 10) {
			log('10 attempts done'); // take actions or throw exception
		}
		console.log("Attempting connection");
		// reconnect after
		return Math.min(options.attempt * 100, 3000); //in ms
	},
});

client.on('connect'     , log('connect', true));
client.on('ready'       , log('ready', true));
client.on('reconnecting', log('reconnecting', true));
client.on('error'       , log('error', true));
client.on('end'         , log('end', true));

// Option 2: If you use PUBLISH/SUBSCRIBE or WATCH then you'll need a separate connection(s)
// TBD