//------------------------------------------------------
// Rate limiting and brute-force protection for Express
// Web Link=> https://github.com/express-rate-limit/express-rate-limit
// Run: node express-rate-limit.js, then hit http://localhost:5000 more than 100 times in 15 minutes
//------------------------------------------------------

import express from 'express';
import { rateLimit } from 'express-rate-limit';

const app = express();
app.use(express.urlencoded({ extended: false }));

// General API limit: 100 requests per IP per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Brute-force protection for login: 5 failed attempts per IP per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts, try again later.' },
});

app.use(apiLimiter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', loginLimiter, (req, res) => {
  const ok = req.body.username === 'demo' && req.body.password === 'demo';
  res.status(ok ? 200 : 401).json({ ok });
});

// Behind a proxy/load balancer, also set: app.set('trust proxy', 1)
app.listen(5000, () => console.log('Listening on http://localhost:5000'));
