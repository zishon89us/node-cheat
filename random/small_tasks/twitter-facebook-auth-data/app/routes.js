import User from './models/user.js';
import { facebookAuth, twitterAuth } from '../config/auth.js';

const isLoggedIn = (req, res, next) => (req.isAuthenticated() ? next() : res.redirect('/'));

export default function routes(app, passport) {
  app.get('/', (req, res) => {
    res.render('index', { facebook: Boolean(facebookAuth), twitter: Boolean(twitterAuth) });
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { user: req.user });
  });

  // State-changing actions use POST so they cannot be triggered by a cross-site link
  app.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => res.redirect('/'));
    });
  });

  if (facebookAuth) {
    app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['email', 'user_location', 'user_birthday'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' }));
  }

  if (twitterAuth) {
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/' }));
  }

  // Unlink: forget the stored OAuth token; the account stays so the user can reconnect later
  app.post('/unlink', isLoggedIn, async (req, res) => {
    await User.updateOne({ _id: req.user._id }, { $unset: { 'social.token': 1 } });
    res.redirect('/profile');
  });
}
