// SendGrid subuser and unsubscribe management via the v3 API (replaces the retired v2 customer.* endpoints).
// Env: SENDGRID_API_KEY (parent account key with subuser permissions).

import { sendgridApi } from './sendgrid_api.js';

const path = (name) => `/subusers/${encodeURIComponent(name)}`;

export const listSubusers = () => sendgridApi('GET', '/subusers');

export const addSubuser = ({ username, email, password, ips }) =>
  sendgridApi('POST', '/subusers', { body: { username, email, password, ips } });

export const disableSubuser = (username) => sendgridApi('PATCH', path(username), { body: { disabled: true } });
export const enableSubuser = (username) => sendgridApi('PATCH', path(username), { body: { disabled: false } });
export const removeSubuser = (username) => sendgridApi('DELETE', path(username));

// Global unsubscribes, managed on a subuser's behalf.
export const unsubscribeEmail = (subuser, email) =>
  sendgridApi('POST', '/asm/suppressions/global', { body: { recipient_emails: [email] }, onBehalfOf: subuser });

export const resubscribeEmail = (subuser, email) =>
  sendgridApi('DELETE', `/asm/suppressions/global/${encodeURIComponent(email)}`, { onBehalfOf: subuser });

export const listUnsubscribes = (subuser) => sendgridApi('GET', '/suppression/unsubscribes', { onBehalfOf: subuser });

if (import.meta.main) {
  console.log(await listSubusers());
}
