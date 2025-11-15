/**
 * Example secure code following best practices
 * Use this as a reference for fixing vulnerabilities
 */

const crypto = require('crypto');
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// ✅ GOOD: Use environment variables for secrets
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// ✅ GOOD: Parameterized SQL queries (using Sequelize example)
async function getUserById(userId) {
  const { User } = require('./models');
  return await User.findByPk(userId); // Parameterized automatically
}

// Alternative with raw query:
async function getUserByIdRaw(userId) {
  const { sequelize } = require('./database');
  return await sequelize.query(
    'SELECT * FROM users WHERE id = :userId',
    {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT
    }
  );
}

// ✅ GOOD: Avoid command execution, use safer alternatives
function processFile(filename) {
  const allowedFiles = ['report.pdf', 'data.csv'];

  if (!allowedFiles.includes(filename)) {
    throw new Error('Invalid filename');
  }

  // Use Node.js APIs instead of shell commands
  const fs = require('fs');
  return fs.readFileSync(`/safe/path/${filename}`);
}

// ✅ GOOD: Sanitize HTML output
function displayUserComment(comment) {
  const textNode = document.createTextNode(comment);
  document.getElementById('comments').appendChild(textNode);
}

// Alternative: Use DOMPurify for HTML
function displayUserHTML(html) {
  const clean = DOMPurify.sanitize(html);
  document.getElementById('content').innerHTML = clean;
}

// ✅ GOOD: Never use eval - use safe alternatives
function parseUserData(jsonString) {
  try {
    return JSON.parse(jsonString); // Safe for JSON
  } catch (error) {
    throw new Error('Invalid JSON data');
  }
}

// ✅ GOOD: Strong cryptography (bcrypt for passwords)
const bcrypt = require('bcrypt');
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// ✅ GOOD: Strong session secret from environment
const app = express();
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET, // Strong random secret from env
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // Not accessible via JavaScript
    maxAge: 3600000, // 1 hour
    sameSite: 'strict' // CSRF protection
  }
}));

// ✅ GOOD: Input validation
app.post('/charge',
  body('amount').isInt({ min: 1, max: 1000000 }),
  body('currency').isIn(['usd', 'eur', 'gbp']),
  query('customer').isAlphanumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency } = req.body;
    const customerId = req.query.customer;

    try {
      const charge = await stripe.charges.create({
        amount,
        currency,
        customer: customerId
      });
      res.json({ success: true, chargeId: charge.id });
    } catch (error) {
      res.status(500).json({ error: 'Payment failed' });
    }
  }
);

// ✅ GOOD: Path traversal protection
const path = require('path');
app.get('/file',
  query('name').matches(/^[a-zA-Z0-9_-]+\.[a-z]{3,4}$/),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filename = req.query.name;
    const safeDir = '/uploads/';
    const fullPath = path.resolve(path.join(safeDir, filename));

    // Ensure the path is within the safe directory
    if (!fullPath.startsWith(path.resolve(safeDir))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.sendFile(fullPath);
  }
);

// ✅ GOOD: Proper error handling (no stack traces to client)
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use((err, req, res, next) => {
  // Log error server-side
  logger.error(err.stack);

  // Send generic error to client
  res.status(500).json({
    error: 'Internal server error',
    // Never send stack traces in production!
  });
});

// ✅ GOOD: MongoDB with authentication
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}?authSource=admin&ssl=true`;

MongoClient.connect(mongoUrl, (err, client) => {
  if (err) {
    logger.error('MongoDB connection failed:', err);
    return;
  }
  logger.info('Connected to MongoDB securely');
});

// ✅ GOOD: HTTPS Server
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

https.createServer(options, app).listen(443, () => {
  logger.info('HTTPS server running on port 443');
});

// ✅ GOOD: Security headers with Helmet
app.use(helmet());

// ✅ GOOD: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// ✅ GOOD: CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

// ✅ GOOD: Structured logging (not console.log)
function processPayment(paymentData) {
  logger.info('Processing payment', {
    amount: paymentData.amount,
    currency: paymentData.currency,
    // Never log sensitive data like card numbers!
  });
}

// Expected SecureAI findings: 0 security issues! 🎉
