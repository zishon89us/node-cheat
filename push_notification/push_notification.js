// Push notifications to Android (Firebase Cloud Messaging HTTP v1) and iOS (APNs token auth).
// GCM and certificate-based APNs connections are retired; this uses their replacements.
// Env:
//   GOOGLE_APPLICATION_CREDENTIALS  path to a Firebase service-account JSON (read by applicationDefault())
//   APNS_KEY_PATH, APNS_KEY_ID, APNS_TEAM_ID, APNS_BUNDLE_ID, APNS_PRODUCTION=true|false
// Usage: import { pushService } from './push_notification.js'; await pushService.send({ androidTokens, iosTokens, title, body, type });

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import apn from '@parse/node-apn';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

let messaging;
let apnProvider;

function fcm() {
  messaging ??= getMessaging(initializeApp({ credential: applicationDefault() }));
  return messaging;
}

function apns() {
  apnProvider ??= new apn.Provider({
    token: { key: requireEnv('APNS_KEY_PATH'), keyId: requireEnv('APNS_KEY_ID'), teamId: requireEnv('APNS_TEAM_ID') },
    production: process.env.APNS_PRODUCTION === 'true',
  });
  return apnProvider;
}

async function sendAndroid(tokens, { title, body, type }) {
  // FCM accepts at most 500 tokens per multicast call.
  const chunks = Array.from({ length: Math.ceil(tokens.length / 500) }, (_, i) => tokens.slice(i * 500, i * 500 + 500));
  let successCount = 0;
  const failedTokens = [];
  for (const chunk of chunks) {
    const res = await fcm().sendEachForMulticast({
      tokens: chunk,
      notification: { title, body },
      data: { type: String(type ?? '') },
      android: { notification: { sound: 'default' } },
    });
    successCount += res.successCount;
    res.responses.forEach((r, i) => !r.success && failedTokens.push(chunk[i]));
  }
  return { successCount, failedTokens };
}

async function sendIos(tokens, { title, body, type }) {
  const note = new apn.Notification({
    alert: { title, body },
    badge: 1,
    sound: 'default',
    topic: requireEnv('APNS_BUNDLE_ID'),
    payload: { type },
  });
  const { sent, failed } = await apns().send(note, tokens);
  return { successCount: sent.length, failedTokens: failed.map((f) => f.device) };
}

export const pushService = {
  async send({ androidTokens = [], iosTokens = [], title, body, type }) {
    const [android, ios] = await Promise.all([
      androidTokens.length ? sendAndroid(androidTokens, { title, body, type }) : null,
      iosTokens.length ? sendIos(iosTokens, { title, body, type }) : null,
    ]);
    return { android, ios };
  },

  shutdown() {
    apnProvider?.shutdown();
  },
};
