/**
 * Created by Zeeshan on 3/11/2016.
 */

var R = require("request");
var stream = require('twitter');
var https = require('https');


var key = '5IMFH1EMpVGSIxly6IUeA';
var secret = 'FOBLpDt8fWrvDJoJCH63cS5uRDh962wCg9Ajh1gEI';
var cat = key + ":" + secret;
var credentials = new Buffer(cat).toString('base64');

var url = 'https://api.twitter.com/oauth2/token';

var client;

R({
    url: url,
    method: 'POST',
    headers: {
        "Authorization": "Basic " + credentials,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials"

}, function (err, resp, body) {

    var an = JSON.parse(body);

    client = new stream({
        consumer_key: '5IMFH1EMpVGSIxly6IUeA',
        consumer_secret: 'FOBLpDt8fWrvDJoJCH63cS5uRDh962wCg9Ajh1gEI',
        access_token_key: an['access_token']
    });
    runIt();

});

function runIt() {
    var params = {q: 'shan89'};
    client.get('users/search.json', params, function(error, tweets, response){
        if (!error) {
            for(var i in tweets)
                console.log(tweets[i].screen_name);
        }
    });
}

describe('OAuth1.0',function(){
    var OAuth = require('oauth');

    it('tests trends Twitter API v1.1',function(done){
        var oauth = new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            '5IMFH1EMpVGSIxly6IUeA',
            'FOBLpDt8fWrvDJoJCH63cS5uRDh962wCg9Ajh1gEI',
            '1.0A',
            null,
            'HMAC-SHA1'
        );
        oauth.get(
            'https://api.twitter.com/1.1/trends/place.json?id=23424977',
            'your user token for this app', //test user token
            'your user secret for this app', //test user secret
            function (e, data, res){
                if (e) console.error(e);
                console.log(require('util').inspect(data));
                done();
            });
    });
});