//------------------------------------------------------
//Read README.md
//Web Link=>
//------------------------------------------------------

var TwitterStrategy = require('passport-twitter').Strategy,
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

                    User.findOne({'id': profile.id}, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.token) {
                                user.token = token;
                                user.name = profile._json.name;
                                user.tokenSecret = tokenSecret;

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
                            newUser.name = profile._json.name;
                            newUser.token = token;
                            newUser.tokenSecret = tokenSecret;

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
                    user.name = profile._json.name;
                    user.token = token;
                    user.tokenSecret = tokenSecret;

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }

            });

        }));


};
