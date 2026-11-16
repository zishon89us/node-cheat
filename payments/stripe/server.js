// Stripe Checkout embedded in your own page (replaces the retired checkout.js "Pay with Card" button).
// Run: STRIPE_SECRET_KEY=sk_test_... STRIPE_PUBLISHABLE_KEY=pk_test_... node server.js

import path from 'node:path';
import express from 'express';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } from '../config.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);
const app = express();
const origin = 'http://localhost:3002';

app.get('/', (req, res) => res.sendFile(path.join(import.meta.dirname, 'embedded.html')));
app.get('/config', (req, res) => res.json({ publishableKey: STRIPE_PUBLISHABLE_KEY }));

// Price and quantity are fixed server-side so the browser cannot change what it pays.
app.post('/checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    mode: 'payment',
    line_items: [
      { quantity: 1, price_data: { currency: 'usd', unit_amount: 999, product_data: { name: 'Widget' } } },
    ],
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });
  res.json({ clientSecret: session.client_secret });
});

app.get('/return', async (req, res) => {
  const sessionId = String(req.query.session_id ?? '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return res.status(400).send('Invalid session id');
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.type('text').send(`Payment status: ${session.payment_status}`);
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3002, 'localhost', () => console.log(`Open ${origin}`));
