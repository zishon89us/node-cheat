/**
 * Created by Zeeshan on 3/19/2016.
 */


var T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY || 'YOUR_CONSUMER_KEY',
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET',
    access_token:         process.env.TWITTER_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN',
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET || 'YOUR_ACCESS_TOKEN_SECRET',
    timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
})

//
//  tweet 'hello world!'
//
T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    console.log(data)
})

//
//  search twitter for all tweets containing the word 'banana' since July 11, 2011
//
T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
    console.log(data)
})