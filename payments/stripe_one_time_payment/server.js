// Stripe customers, saved payment methods, immediate and authorize-then-capture payments (PaymentIntents).
// Run: STRIPE_SECRET_KEY=sk_test_... STRIPE_PUBLISHABLE_KEY=pk_test_... node server.js
// Card details never touch this server: the browser collects them with Stripe Elements.

import path from 'node:path';
import express from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } from '../config.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));
app.use(express.json());

const id = (prefix) => z.string().regex(new RegExp(`^${prefix}_[A-Za-z0-9]+$`));
const amount = z.number().int().positive().max(99_999_999);
const currency = z
  .string()
  .regex(/^[a-z]{3}$/)
  .default('usd');

function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const err = new Error(z.prettifyError(result.error));
    err.status = 400;
    throw err;
  }
  return result.data;
}

app.get('/', (req, res) =>
  res.render('create_customer', { publishableKey: STRIPE_PUBLISHABLE_KEY }),
);
app.get('/page2', (req, res) =>
  res.render('card_token', { publishableKey: STRIPE_PUBLISHABLE_KEY }),
);

app.get('/customer', async (req, res) => {
  const { customer_id } = parse(z.object({ customer_id: id('cus') }), req.query);
  res.json({ customer: await stripe.customers.retrieve(customer_id) });
});

// Create a customer plus a SetupIntent the browser confirms to save a card for later charges.
app.post('/customer', async (req, res) => {
  const { email, description } = parse(
    z.object({ email: z.email(), description: z.string().max(350).optional() }),
    req.body,
  );
  const customer = await stripe.customers.create({ email, description });
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    usage: 'off_session',
  });
  res.json({ customer, clientSecret: setupIntent.client_secret });
});

app.post('/add-card', async (req, res) => {
  const { customer_id, payment_method } = parse(
    z.object({ customer_id: id('cus'), payment_method: id('pm') }),
    req.body,
  );
  res.json({
    paymentMethod: await stripe.paymentMethods.attach(payment_method, { customer: customer_id }),
  });
});

app.post('/delete-card', async (req, res) => {
  const { payment_method } = parse(z.object({ payment_method: id('pm') }), req.body);
  res.json({ paymentMethod: await stripe.paymentMethods.detach(payment_method) });
});

const chargeBody = z.object({
  customer_id: id('cus'),
  payment_method: id('pm'),
  amount,
  currency,
  description: z.string().max(1000).optional(),
});

async function chargeSavedCard(body, captureMethod) {
  return stripe.paymentIntents.create({
    customer: body.customer_id,
    payment_method: body.payment_method,
    amount: body.amount,
    currency: body.currency,
    description: body.description,
    capture_method: captureMethod,
    off_session: true,
    confirm: true,
    statement_descriptor_suffix: 'NODE CHEAT',
    metadata: { node_cheat_by: 'https://github.com/zishon89us' },
  });
}

app.post('/charge-immediate', async (req, res) => {
  res.json({ paymentIntent: await chargeSavedCard(parse(chargeBody, req.body), 'automatic') });
});

// Authorize now, capture later (within the card network's hold window, usually 7 days).
app.post('/charge-hold', async (req, res) => {
  res.json({ paymentIntent: await chargeSavedCard(parse(chargeBody, req.body), 'manual') });
});

app.post('/charge-capture', async (req, res) => {
  const { payment_intent_id, amount_to_capture } = parse(
    z.object({ payment_intent_id: id('pi'), amount_to_capture: amount.optional() }),
    req.body,
  );
  res.json({
    paymentIntent: await stripe.paymentIntents.capture(payment_intent_id, { amount_to_capture }),
  });
});

app.get('/charge', async (req, res) => {
  const { payment_intent_id } = parse(z.object({ payment_intent_id: id('pi') }), req.query);
  res.json({
    paymentIntent: await stripe.paymentIntents.retrieve(payment_intent_id, {
      expand: ['customer'],
    }),
  });
});

app.get('/event', async (req, res) => {
  const { event_id } = parse(z.object({ event_id: id('evt') }), req.query);
  res.json({ event: await stripe.events.retrieve(event_id) });
});

app.use((err, req, res, _next) => {
  if (err.status === 400) return res.status(400).json({ error: err.message });
  if (err instanceof Stripe.errors.StripeError) {
    return res.status(err.statusCode ?? 402).json({ error: err.message, code: err.code });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Stripe.js works on http://localhost; serve over HTTPS (or behind a TLS proxy) everywhere else.
app.listen(3001, 'localhost', () => console.log('Open http://localhost:3001'));
