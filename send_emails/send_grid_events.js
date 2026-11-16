// SendGrid event tracking and Event Webhook setup via the v3 API (replaces the retired api_user/api_key v2 endpoints).
// Env: SENDGRID_API_KEY. Run: EVENT_WEBHOOK_URL=https://example.com/sendgrid/events node send_grid_events.js

import { sendgridApi } from './sendgrid_api.js';

export const enableOpenTracking = () => sendgridApi('PATCH', '/tracking_settings/open', { body: { enabled: true } });
export const disableOpenTracking = () => sendgridApi('PATCH', '/tracking_settings/open', { body: { enabled: false } });

// Choose which events SendGrid POSTs to your webhook.
export const configureEventWebhook = (url, events = {}) =>
  sendgridApi('PATCH', '/user/webhooks/event/settings', {
    body: {
      enabled: true,
      url,
      processed: false,
      dropped: true,
      deferred: false,
      delivered: false,
      bounce: true,
      click: false,
      open: true,
      unsubscribe: false,
      group_unsubscribe: false,
      group_resubscribe: false,
      spam_report: false,
      ...events,
    },
  });

export const getEventWebhook = () => sendgridApi('GET', '/user/webhooks/event/settings');

// Assign dedicated sending IPs to a subuser.
export const setSubuserIps = (subuser, ips) => sendgridApi('PUT', `/subusers/${encodeURIComponent(subuser)}/ips`, { body: ips });

if (import.meta.main) {
  const url = process.env.EVENT_WEBHOOK_URL;
  if (!url?.startsWith('https://')) throw new Error('Set EVENT_WEBHOOK_URL to a public https:// endpoint');
  await enableOpenTracking();
  console.log(await configureEventWebhook(url));
}
