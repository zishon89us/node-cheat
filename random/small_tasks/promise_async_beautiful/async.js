/**
 * Created by Zeeshan on 4/5/2016.
 */


'use strict';

var requestify = require('requestify');
var async = require('async');
var request = require('request');
var moment = require('moment');

exports.event = function (req, res, next) {

    var bands = "http://api.bandsintown.com/events/search?location="
        + req.params.city
        + "&radius=" + req.params.radius
        + "&format=json";


    /*get bands in city with radius limit in json*/
    requestify.get(bands).then(function (response) {
        var localBands = response.getBody();
        var weatherUrls = []
            , artistUrls = []
            , finalResult =  [];

        localBands.forEach(function (v, i) {
            weatherUrls.push(getWeatherUrl(v.venue.latitude, v.venue.longitude));
            artistUrls.push(getArtistUrl(v.artists[0].name));
            //crunch event info
            finalResult.push({
                eventInfo:{
                    "datetime": v.datetime,
                    "ticket_status": v.ticket_status,
                    "city": v.venue.city,
                    "name": v.venue.name,
                    "latitude": v.venue.latitude,
                    "longitude": v.venue.longitude
                }});
        });
        async.waterfall([
            function (cb) {
                //fetch data for weather and artists
                async.parallel({
                        weather: function (callback) {
                            async.map(weatherUrls, request, callback);
                        },
                        artists: function (callback) {
                            async.map(artistUrls, request, callback);
                        }
                    },
                    function (err, results) {
                        cb(null, results);
                    });
            },
            function (results, callback) {
                //generate urls for top-tracks
                var tracksUrls = [];
                var country = JSON.parse(results.weather[0].body).city.country;
                //crunch data of weather and artist
                for(var i in results.weather){
                    var localWeather = JSON.parse(results.weather[i].body),
                        localArtist = JSON.parse(results.artists[i].body).artists.items;

                    //generating urls for artist-top-tracks
                    tracksUrls.push(getTracksUrl(localArtist[0].id, country));

                    finalResult[i].weather ={
                        "datetime": localWeather.list[0].dt_txt,
                        "temp": localWeather.list[0].main.temp,
                        "temp_min": localWeather.list[0].main.temp_min,
                        "temp_max": localWeather.list[0].main.temp_max,
                        "humidity": localWeather.list[0].main.humidity,
                        "description": localWeather.list[0].weather[0].description
                    };
                    finalResult[i].artist = [{
                        name:localArtist[0].name ? localArtist[0].name : "-Unknown-"
                    }];
                }

                //fetch top-tracks now
                async.parallel({
                        tracks: function (callback) {
                            async.map(tracksUrls, request, callback);
                        }
                    },
                    function (err, results) {
                        callback(null, results);
                    });

            },
            function (tracks, callback) {
                //crunch top-tracks
                //was to be done here
                callback(null, finalResult);
            }
        ], function (err, result) {
            //do in-memory redis stuff
            //send results to client
        });

    });
};

/*openweathermap weather url generator function
 * @param lat, long
 * returns url
 * */
function getWeatherUrl(lat, lon) {
    return "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=661113baa79e652cd0a6c719bff9aa71";
}

/*spotify artist url generator function
 * @param artist-name
 * returns url
 * */
function getArtistUrl(artistName) {
    return "https://api.spotify.com/v1/search?q=" + refineArtistName(artistName) + "&offset=0&limit=1&type=artist";
}

/*spotify artist-tracks url generator function
 * @param artist-id, country
 * returns url
 * */
function getTracksUrl(artistId, country) {
    return "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?country=" + country;
}

/*refines artist name to be query-able in spotify api
 * @param artist-name
 * return refined-artist-name
 * */
function refineArtistName(artistName) {
    return artistName.replace(/([a-z])(?=[A-Z])|\s*\d{4}\b/g, function (m, g) {
        return g ? g + " " : "";
    }).split(' ').join('+');
}

/*utility function to remove duplicate elements in array
 * @param array
 * return array
 * */
function uniqueArray(arr) {
    var map = {}, result;
    var arrLen = arr.length;
    for (var i = 0; i < arrLen; i++) {
        if (!map[arr[i]]) {
            map[arr[i]] = 1;
            result.push(arr[i]);
        }
    }
    return result;
}