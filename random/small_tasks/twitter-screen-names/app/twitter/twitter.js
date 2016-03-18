/**
 * Created by Zeeshan on 3/18/2016.
 */


var Twit = require('twit'),
    async = require('async'),
    configAuth = require('../../config/auth');

exports.usernames = function (req, res, next) {

    if(!req.user){
        res.redirect('/');
        return;
    }

    var T = new Twit({
        consumer_key:         configAuth.twitterAuth.consumerKey,
        consumer_secret:      configAuth.twitterAuth.consumerSecret,
        access_token:         req.user.token,
        access_token_secret:  req.user.tokenSecret,
        timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
    });

    //https://docs.google.com/spreadsheets/d/1n7DxgJTTHZ9w3xwiHokUhXMLkBwpP5c9ZLFmsYFDCic/edit?usp=sharing
    var GoogleSpreadsheet = require("google-spreadsheet"),
        _ = require('underscore');

    var sheetId = req.params.sheet || "1n7DxgJTTHZ9w3xwiHokUhXMLkBwpP5c9ZLFmsYFDCic",
        sheet = new GoogleSpreadsheet(sheetId);

    async.waterfall([
        function (cb) {
            sheet.getRows(1, {}, function (err, rows) {
                if (err) { res.send(err); return;};
                var names = [];
                _.each(rows, function (row) {
                    names.push(row.first + " " + row.last);
                });
                cb(null, names);
            });
        },
        function (names, callback1) {

            async.map(names, function(name, cb){
                T.get('users/search', { q: name, page: 1 }, function (err, data, response) {
                    if(data.length)
                        cb(null, {screen_name: data[0].screen_name, name:data[0].name});
                    else
                        cb(null, {screen_name: "no_data_retrieved", name: name});
                });
            }, function (err, results) {
                callback1(null, results);
            });

        },
        function (users, callback) {
            console.log(users);
            res.send(users);
            //send data to client
        }
    ], function (err, result) {
        //do in-memory redis stuff
        //send results to client
    });
}
