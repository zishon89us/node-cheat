var FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    User = require('../app/models/user'),
    configAuth = require('./auth');

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
    passport.use(new FacebookStrategy({

            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
            profileFields: ['id', 'emails', 'name']
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {

                if (!req.user) {

                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = profile.emails[0].value;

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

                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.facebook.email = profile.emails[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = profile.emails[0].value;

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
                                user.lastName = name.length > 2 ? name[2] : name[1] ;

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
                            newUser.firstName = name[0];
                            newUser.lastName = name.length > 2 ? name[2] : name[1] ;
                            newUser.gender = profile.gender || "Not Provided";
                            newUser.locale = profile._json.lang;
                            newUser.email = profile.email || "Not Provided";
                            var loc = profile._json.location.split(',');
                            newUser.location.city = loc.length >1 ? loc[0] : "";
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

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session
                     user.s_id = profile.id;
                    user.s_token = token;
                    var name = profile._json.name.split(' ');
                    user.firstName = name[0];
                    user.lastName = name.length > 2 ? name[2] : name[1] ;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }

            });

        }));


};
