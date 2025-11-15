/**
 * Example vulnerable code for testing SecureAI
 * This file intentionally contains security vulnerabilities
 * DO NOT use this code in production!
 */

// 🔴 CRITICAL: Hardcoded AWS Credentials
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// 🔴 CRITICAL: Hardcoded API Keys
const PAYMENT_API_KEY = "pk_production_1234567890abcdefghijklmnopqrstuvwxyz";
const EMAIL_API_KEY = "email_api_1234567890abcdefghijklmnopqrstuvwxyz";

// 🔴 CRITICAL: Private Key Exposed
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890...
-----END RSA PRIVATE KEY-----`;

// 🟠 HIGH: SQL Injection Vulnerability
function getUserById(userId) {
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  return database.execute(query);
}

// 🟠 HIGH: Command Injection
function executeUserCommand(cmd) {
  const exec = require('child_process').exec;
  exec(cmd, (error, stdout, stderr) => {
    console.log(stdout);
  });
}

// 🟠 HIGH: XSS via innerHTML
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}

// 🟠 HIGH: eval() with User Input
function processUserCode(code) {
  eval(code); // Extremely dangerous!
}

// 🟡 MEDIUM: Weak Cryptography (MD5)
const crypto = require('crypto');
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// 🟡 MEDIUM: Weak Session Secret
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'my-simple-secret', // Too weak!
  resave: false,
  saveUninitialized: true
}));

// 🟡 MEDIUM: Missing Input Validation
app.post('/charge', (req, res) => {
  const amount = req.body.amount; // No validation!
  const customerId = req.query.customer; // No validation!

  stripe.charges.create({
    amount: amount,
    currency: 'usd',
    customer: customerId
  });
});

// 🟡 MEDIUM: Path Traversal
const fs = require('fs');
app.get('/file', (req, res) => {
  const filename = req.query.name;
  fs.readFile('/uploads/' + filename, (err, data) => {
    res.send(data);
  });
});

// 🟡 MEDIUM: Error Stack Exposure
app.use((err, req, res, next) => {
  res.status(500).send({
    error: err.message,
    stack: err.stack // Exposes internal details!
  });
});

// 🔵 LOW: console.log in Production
function processPayment(paymentData) {
  console.log('Processing payment:', paymentData); // May leak sensitive data
  // ... payment logic
}

// 🟡 MEDIUM: MongoDB Without Authentication
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/mydb'; // No credentials!

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  console.log('Connected to database');
});

// 🟡 MEDIUM: HTTP Instead of HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Insecure connection!');
}).listen(8080);

// Expected SecureAI findings: ~15+ security issues
// This demonstrates the power of automated security scanning!
