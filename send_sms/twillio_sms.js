// Send an SMS to several recipients with Twilio.
// Run: TWILIO_ACCOUNT_SID=AC... TWILIO_AUTH_TOKEN=... TWILIO_PHONE_NUMBER=+15550001111 node twillio_sms.js +15551234567 +923001234567

import twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  throw new Error('Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER');
}

const recipients = process.argv.slice(2);
const invalid = recipients.filter((to) => !/^\+[1-9]\d{6,14}$/.test(to));
if (recipients.length === 0 || invalid.length) {
  throw new Error(
    `Pass E.164 phone numbers as arguments${invalid.length ? `; invalid: ${invalid.join(', ')}` : ''}`,
  );
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const body = 'Hello via Node-Cheat!';

const results = await Promise.allSettled(
  recipients.map((to) => client.messages.create({ to, from: TWILIO_PHONE_NUMBER, body })),
);

results.forEach((result, i) => {
  if (result.status === 'fulfilled')
    console.log(`SMS queued for ${recipients[i]} (${result.value.sid})`);
  else console.error(`SMS to ${recipients[i]} failed: ${result.reason.message}`);
});
