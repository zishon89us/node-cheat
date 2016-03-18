//------------------------------------------------------
//Read README.md
//Web Link=>
//------------------------------------------------------

var FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    User = require('../app/models/user'),
    configAuth = require('./auth');
var request = require('request');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //fb
    //https://developers.facebook.com/tools/explorer/1017328211677854?method=GET&path=me%3Ffields%3Dlocation&version=v2.5
    passport.use(new FacebookStrategy({

            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
            profileFields: ['id', 'emails', 'name', 'birthday', 'gender', 'location', 'hometown', 'locale', 'age_range']
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {

                if (!req.user) {

                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            if (!user.token) {
                                user.token = token;
                                user.firstName = profile._json.first_name;
                                user.lastName = profile._json.last_name;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            request("https://graph.facebook.com/v2.5/me?fields=id,name,location,age_range,email,birthday,hometown,gender&access_token=" + token, function (err, resp, body) {
                                if (!err && resp.statusCode == 200) {
                                    console.log(body);
                                    newUser.s_id = profile.id;
                                    newUser.token = token;
                                    newUser.age = profile._json.birthday; // store birth_date calc age each time
                                    newUser.age_range = profile._json.age_range.min;
                                    newUser.firstName = profile._json.first_name;
                                    newUser.lastName = profile._json.last_name;
                                    newUser.gender = profile.gender || "Not Provided";
                                    newUser.locale = profile._json.locale;
                                    newUser.email = profile._json.email || "Not Provided";
                                    var loc = profile._json.location.name.split(',');
                                    newUser.location.city = loc.length > 1 ? loc[0] : "";
                                    newUser.location.state = loc.length > 1 ? loc[1] : loc[0];
                                    newUser.social.id = profile.id;
                                    newUser.social.socialType = profile.provider;


                                    newUser.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, newUser);
                                    });
                                }
                            });

                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.s_id = profile.id;
                    user.token = token;
                    user.firstName = profile._json.first_name;
                    user.lastName = profile._json.last_name;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }
            });

        }));

    //twitter
    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            passReqToCallback: true

        },
        function (req, token, tokenSecret, profile, done) {

            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({'s_id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.token) {
                                user.token = token;
                                var name = profile._json.name.split(' ');
                                user.firstName = name[0];
                                user.lastName = name.length > 2 ? name[2] : name[1];

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.s_id = profile.id;
                            newUser.token = token;
                            var name = profile._json.name.split(' ');
                            newUser.age = 'Not Provide by Twitter'; // store birth_date calc age each time
                            newUser.age_range = 'Not Provide by Twitter';
                            newUser.firstName = name[0];
                            newUser.lastName = name.length > 2 ? name[2] : name[1];
                            newUser.locale = profile._json.lang;
                            newUser.email = profile.email || "Not Provided";
                            var loc = profile._json.location.split(',');
                            newUser.location.city = loc.length > 1 ? loc[0] : "";
                            newUser.location.state = loc.length > 1 ? loc[1] : loc[0];
                            newUser.social.id = profile.id;
                            newUser.social.socialType = profile.provider;

                            request("http://api.namsor.com/onomastics/api/json/gender/" + newUser.firstName + "/" + newUser.lastName, function (err, resp, body) {
                                if (!err && resp.statusCode == 200) {
                                    console.log(body);

                                    newUser.gender = JSON.parse(body).gender || "Not Provided";

                                    newUser.save(function (err) {
                                        if (err)
                                            throw err;
                                        return done(null, newUser);
                                    });
                                }
                            });

                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session
                    user.s_id = profile.id;
                    user.s_token = token;
                    var name = profile._json.name.split(' ');
                    user.firstName = name[0];
                    user.lastName = name.length > 2 ? name[2] : name[1];

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }

            });

        }));


};
