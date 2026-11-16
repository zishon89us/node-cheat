//------------------------------------------------------
// Xero API with OAuth 2.0 (xero-node): connect an organisation, then list pay runs and invoices
// Web Link=> https://developer.xero.com/documentation/guides/oauth2/auth-flow
// Run: XERO_CLIENT_ID=... XERO_CLIENT_SECRET=... node xero.js, then open http://localhost:3000/connect
//------------------------------------------------------

import express from 'express';
import { XeroClient } from 'xero-node';
import { XeroService } from './xeroService.js';

const { XERO_CLIENT_ID, XERO_CLIENT_SECRET } = process.env;
if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET)
  throw new Error('Set XERO_CLIENT_ID and XERO_CLIENT_SECRET');

const port = Number(process.env.PORT ?? 3000);

const xero = new XeroClient({
  clientId: XERO_CLIENT_ID,
  clientSecret: XERO_CLIENT_SECRET,
  redirectUris: [`http://localhost:${port}/callback`],
  scopes: (
    process.env.XERO_SCOPES ??
    'openid profile email offline_access accounting.settings accounting.transactions accounting.reports.read payroll.payruns'
  ).split(' '),
});

const app = express();
let service;

app.get('/connect', async (req, res) => {
  res.redirect(await xero.buildConsentUrl());
});

app.get('/callback', async (req, res) => {
  try {
    await xero.apiCallback(req.url);
    await xero.updateTenants();
    service = new XeroService(xero, xero.tenants[0].tenantId);
    res.redirect('/payruns');
  } catch (err) {
    console.error(err);
    res.status(400).send('Xero authorization failed');
  }
});

const requireConnection = (req, res, next) => (service ? next() : res.redirect('/connect'));

app.get('/payruns', requireConnection, async (req, res) => {
  res.json(await service.getPayRuns());
});

app.get('/invoices', requireConnection, async (req, res) => {
  const { from, to } = req.query;
  res.json(await service.getInvoices(from, to));
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Request to Xero failed' });
});

await xero.initialize();
app.listen(port, () => console.log(`Open http://localhost:${port}/connect`));
