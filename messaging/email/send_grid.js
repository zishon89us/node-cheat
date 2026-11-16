// Send one email with SendGrid's official Node.js library.
// Run: SENDGRID_API_KEY=SG.... MAIL_FROM=you@yourdomain.com MAIL_TO=friend@example.com node send_grid.js

import sgMail from '@sendgrid/mail';

const { SENDGRID_API_KEY, MAIL_FROM, MAIL_TO } = process.env;
if (!SENDGRID_API_KEY || !MAIL_FROM || !MAIL_TO) {
  throw new Error('Set SENDGRID_API_KEY, MAIL_FROM (verified sender) and MAIL_TO');
}

sgMail.setApiKey(SENDGRID_API_KEY);

const [response] = await sgMail.send({
  from: `Node-Cheat <${MAIL_FROM}>`,
  to: MAIL_TO,
  subject: 'Hello Developer!',
  text: 'I am sent from Node-Cheat using SendGrid :)',
  html: '<strong>I am sent from Node-Cheat using SendGrid :)</strong>',
});
console.log('SendGrid accepted the message:', response.statusCode);
