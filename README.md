# node-cheat

Small, runnable Node.js examples for everyday tasks: cloud storage, payments, email/SMS, real-time chat, files, databases and more. They were first written in 2016–2018 and **rewritten in 2026** for current Node.js and current library versions.

[![CI](https://github.com/zishon89us/node-cheat/actions/workflows/ci.yml/badge.svg)](https://github.com/zishon89us/node-cheat/actions/workflows/ci.yml)

Also in this repo: **[SecureAI](./secureai)**, a GitHub App that scans pull requests for security issues and uses Claude to triage findings.

## What "modern" means here

- Node.js 22+ (`.nvmrc` pins 24), native ES modules, `node:` built-ins
- `async`/`await` everywhere and built-in `fetch`; no callbacks, `request`, `q` or `async.js`
- Current SDKs: AWS SDK v3, Stripe PaymentIntents, Express 5, socket.io 4, MongoDB 7, Mongoose 9, node-redis, twitter-api-v2, xero-node
- No credentials in code. Everything is read from environment variables (see [`.env.example`](.env.example))
- Input validated at the edges, no stack traces sent to clients, path-traversal and XSS guards where relevant

## Quick start

```bash
nvm use                       # Node 24
npm install
cp .env.example .env          # fill in what your example needs
node --env-file=.env express/app.js
```

Folders that have their own `package.json` (the chat apps, WebRTC, and some sub-apps under `random/` and `stackoverflow_answers/`) are installed and run from inside that folder.

## Examples

### Cloud — AWS

- [S3 bucket CRUD](aws/s3/create_bucket.js) · [Upload base64 data to S3](aws/s3/upload_base_64.js)
- [Stream uploads straight to S3 with multer-s3](aws/express_multer_s3/app.js)
- [Lambda: merge images with sharp](aws/lamda/image_merge.js)
- [SQS polling worker](aws/sqs_service_worker/polling_agent.js) · [Start a Step Functions execution](aws/step-functions/app.js)

### Payments — Stripe

- [PaymentIntents, customers, saved cards, authorize & capture](payments/stripe_one_time_payment/server.js)
- [Embedded Checkout](payments/stripe/server.js)

### Messaging

- Email (SendGrid): [send](send_emails/send_grid.js) · [reusable module](send_emails/module.js) · [event webhook](send_emails/send_grid_events.js) · [subusers](send_emails/send_grid_sub_user.js) · [raw v3 API](send_emails/sendgrid_api.js)
- [SMS with Twilio](send_sms/twillio_sms.js) · [Fax with Telnyx](fax/send_fax.js)
- [Push notifications: FCM + APNs](push_notification/push_notification.js)

### Real-time

- socket.io chat: [one-to-one](chat/one_one_chat/app.js) · [simple room](chat/simple_chat/index.js)
- [WebRTC video chat with socket.io signaling](WebRTC/simple_video_chat)

### Web servers

- Express 5: [routes & API](express/app.js) · [gzip compression](express/gzip/app.js) · [safe child processes](express/index.js)
- [HTTPS with Node and with Express](HTTPS) · [Static hosting](static-hosting/index.js) · [Graceful deploy/shutdown](deployment/2018_style.js)
- [Rate limiting](random/small_tasks/rate-limiter/express-rate-limit.js) · [Restrict static files](random/small_tasks/express_server_restrict_static_files/app.js)
- [Express app generator layout](random/small_tasks/standalone-express-server)

### Files and media

- [Read a file](files/read_file.js) · [Write a file](files/write_file.js) · [Read line by line](files/line_by_line.js) · [Read a directory](files/read_dir_files.js)
- File downloads: [http](files/download_file_http_server/app.js) · [Express](files/express_server_download_file/app.js) · [Express & Koa static](random/small_tasks/download_files_server)
- [Serve a PDF](pdf/pdf_browser/app.js) · [ffmpeg thumbnails](ffmpeg/ffmpeg.js) · [Write .xlsx](random/tiny_useful_modules/write_xlsx.js) · [Unzip](random/tiny_useful_modules/unzip/unzip.js)

### Databases

- MongoDB: [bulk update](mongodb/bulk-update.js) · [GridFS streaming upload](gridfs/direct_upload_gridfs/app.js)
- Redis: [service wrapper](data_storages/redis/redis_service.js) · [reconnect strategy](redis/connect-retry.js)

### Auth and third-party APIs

- Passport: [X + Facebook login](random/small_tasks/twitter-facebook-auth-data) · [X screen names](random/small_tasks/twitter-screen-names)
- [X OAuth 1.0a](random/small_tasks/twitter_auth.js) · [Search posts](random/small_tasks/search_tweets.js)
- [Xero OAuth 2](random/small_tasks/xero_api/xero.js) · [Google Sheets](random/tiny_useful_modules/google_spreadsheets.js) · [YouTube channel videos](random/small_tasks/youtube-videos/list_channel_videos.js)
- [Exchange rates](random/small_tasks/exchange_api.js) · [Gender by name](random/small_tasks/gender_by_name.js)

### Utilities

- [HMAC signatures](random/tiny_useful_modules/hmac_signature.js) · [Generate key pairs](random/tiny_useful_modules/generate_privatekey.js) · [AES-256-GCM encryption](stackoverflow_answers/crypto-create-cipheriv.js)
- [Coupon codes](random/tiny_useful_modules/coupon-code.js) · [Language detection](random/tiny_useful_modules/language_detection.js) · [Transliteration](string/tranliterate.js)
- [Image size without a full download](random/tiny_useful_modules/image_size_probability.js) · [Expand short URLs](random/tiny_useful_modules/long_url.js) · [Website screenshots](random/tiny_useful_modules/screenshot.js) · [Headless scraping](scraping/dynamic_webpages_scraping.js)
- [Cron jobs](random/small_tasks/cron-jobs/cron_jobs.js) · [Durations](day/duration.js) · [Dynamic imports](dynamic-execution/start.js) · [List built-in modules](random/tiny_useful_modules/builtin-modules.js)
- [Node essentials: events, streams, readline, timers, process](random/tiny_useful_modules/node_essential)

### Answers from Stack Overflow

[Promises in loops](stackoverflow_answers/loop-await/loop-await.js) · [Error handling](stackoverflow_answers/error-handling.js) · [finally](stackoverflow_answers/always-then.js) · [Deep copy a directory](stackoverflow_answers/copy-dir-deep.js) · [Nested plugin loading](stackoverflow_answers/require_nested/app.js) · [Streaming XML](stackoverflow_answers/xml-streamer/main.js) · [Resample WAV to 8 kHz](stackoverflow_answers/wav-8000hz/wav.js) · [and more](stackoverflow_answers)

One-liners and tips: [awsome](awsome/README.md)

## Development

```bash
npm run lint          # ESLint 10 with eslint-plugin-security
npm run format:check  # Prettier
npm test              # every example parses as ESM, uses no require(), and declares its imports
```

CI runs all of these on Node 22 and 24, plus `npm audit`, CodeQL and SecureAI's own checks. Dependabot keeps dependencies current.

## Security

See [SECURITY.md](SECURITY.md). These are teaching examples. Add authentication and review them before you deploy any of them.

## License

ISC
