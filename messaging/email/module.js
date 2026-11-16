// Plug-and-play transactional email helpers on top of @sendgrid/mail.
// Env: SENDGRID_API_KEY, MAIL_FROM (a verified sender), CONTACT_EMAIL (inbox for contact-form messages).
// Usage: import { emailUtil } from './module.js'; await emailUtil.verificationCode('a@b.com', '123456');

import sgMail from '@sendgrid/mail';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

sgMail.setApiKey(requireEnv('SENDGRID_API_KEY'));
const from = requireEnv('MAIL_FROM');
const contactEmail = process.env.CONTACT_EMAIL ?? from;

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

const footer = '<div>Add footer content here, e.g. an unsubscribe link or company info.</div>';

async function sendMail({ to, subject, html, text, replyTo }) {
  const [response] = await sgMail.send({
    from,
    to,
    subject,
    replyTo,
    text,
    html: html && `<div>${html}<br>${footer}</div>`,
  });
  return response.statusCode;
}

export const emailUtil = {
  verificationCode: (email, code) =>
    sendMail({
      to: email,
      subject: 'Your verification code',
      html: `<p>Please use this verification code: <em>${escapeHtml(code)}</em></p>`,
    }),

  forgotPassword: (email, code) =>
    sendMail({
      to: email,
      subject: 'Forgot Password Request',
      html: `<p>Please use ${escapeHtml(code)} to reset your password.</p>`,
    }),

  // Send from your own verified address and put the visitor in Reply-To; sending "from" them gets rejected as spoofing.
  contactUs: ({ email, subject, message }) =>
    sendMail({
      to: contactEmail,
      replyTo: email,
      subject: subject || 'Contact Us form',
      text: `From: ${email}\n\n${message}`,
    }),
};

export default emailUtil;
