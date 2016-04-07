/**
 * Created by Zeeshan on 4/7/2016.
 */


//------------------------------------------------------
//Get long url of a shortened url
//Web Link=>
//------------------------------------------------------


var google = require('googleapis'),
    urlshortener = google.urlshortener('v1'),
    params = { shortUrl: 'http://goo.gl/xKbRu3' };

// get the long url of a shortened url
urlshortener.url.get(params, function (err, response) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('Long url is ', response.longUrl);
    }
});