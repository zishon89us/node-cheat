import User from './models/user.js';
import { usernames } from './twitter/twitter.js';

const isLoggedIn = (req, res, next) => (req.isAuthenticated() ? next() : res.redirect('/'));

export default function routes(app, passport) {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { user: req.user });
  });

  app.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => res.redirect('/'));
    });
  });

  app.get('/twitter/usernames', isLoggedIn, usernames);

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/' }));

  // Unlink: forget the stored OAuth credentials; the account stays so the user can reconnect
  app.post('/unlink/twitter', isLoggedIn, async (req, res) => {
    await User.updateOne({ _id: req.user._id }, { $unset: { token: 1, tokenSecret: 1 } });
    res.redirect('/profile');
  });
}
