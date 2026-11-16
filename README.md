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
node --env-file=.env web/express/app.js
```

Folders with their own `package.json` (the chat and WebRTC apps, the Passport apps in `auth/`, `web/express-generator-app`, and a few in `stackoverflow_answers/`) are installed and run from inside that folder.

## Examples

Each top-level folder is one category.

### [`aws/`](aws)

- [S3 bucket CRUD](aws/s3/create_bucket.js) · [Upload base64 data to S3](aws/s3/upload_base_64.js)
- [Stream uploads straight to S3 with multer-s3](aws/express_multer_s3/app.js)
- [Lambda: merge images with sharp](aws/lambda/image_merge.js)
- [SQS polling worker](aws/sqs_service_worker/polling_agent.js) · [Start a Step Functions execution](aws/step-functions/app.js)

### [`payments/`](payments) — Stripe

- [PaymentIntents, customers, saved cards, authorize & capture](payments/stripe_one_time_payment/server.js)
- [Embedded Checkout](payments/stripe/server.js)

### [`messaging/`](messaging)

- Email (SendGrid): [send](messaging/email/send_grid.js) · [reusable module](messaging/email/module.js) · [event webhook](messaging/email/send_grid_events.js) · [subusers](messaging/email/send_grid_sub_user.js) · [raw v3 API](messaging/email/sendgrid_api.js)
- [SMS with Twilio](messaging/sms/twilio_sms.js) · [Fax with Telnyx](messaging/fax/send_fax.js)
- [Push notifications: FCM + APNs](messaging/push/push_notification.js)

### [`realtime/`](realtime)

- socket.io chat: [one-to-one](realtime/chat/one_one_chat/app.js) · [simple room](realtime/chat/simple_chat/index.js)
- [WebRTC video chat with socket.io signaling](realtime/webrtc/simple_video_chat)

### [`web/`](web)

- Express 5: [routes & API](web/express/app.js) · [gzip compression](web/express/gzip/app.js) · [safe child processes](web/express/index.js) · [views](web/express-views/app.js) · [generator layout](web/express-generator-app)
- [HTTPS with Node and with Express](web/https) · [Static hosting](web/static-hosting/index.js) · [Graceful shutdown](web/graceful-shutdown/server.js)
- [Rate limiting](web/rate-limiting/express-rate-limit.js) · [Restrict static files](web/restrict-static-files/app.js)

### [`files/`](files)

- [Read a file](files/read_file.js) · [Write a file](files/write_file.js) · [Read line by line](files/line_by_line.js) · [Read a directory](files/read_dir_files.js)
- Downloads: [http](files/download_file_http_server/app.js) · [Express](files/express_server_download_file/app.js) · [Express & Koa static](files/static-downloads)
- [Write .xlsx](files/write_xlsx.js) · [Unzip](files/unzip/unzip.js)

### [`media/`](media)

- [ffmpeg thumbnails](media/ffmpeg/generate_thumbnail_approach_1.js) · [Serve a PDF](media/pdf/pdf_browser/app.js)
- [Website screenshots](media/screenshot.js) · [Headless scraping](media/scraping/dynamic_webpages_scraping.js) · [Image size without a full download](media/image_size.js)

### [`databases/`](databases)

- MongoDB: [bulk update](databases/mongodb/bulk-update.js) · [GridFS streaming upload](databases/gridfs/direct_upload_gridfs/app.js)
- Redis: [service wrapper](databases/redis/redis_service.js) · [reconnect strategy](databases/redis/connect-retry.js)

### [`auth/`](auth)

- Passport: [X + Facebook login](auth/passport-x-facebook) · [X screen names](auth/passport-x-screen-names)
- [X OAuth 1.0a request signing](auth/x_oauth.js)

### [`apis/`](apis) — third-party HTTP APIs

- [Search X posts](apis/x_search_posts.js) · [Xero OAuth 2](apis/xero/xero.js) · [YouTube channel videos](apis/youtube/list_channel_videos.js)
- [Google Sheets](apis/google_sheets.js) · [Alfred workflow over a sheet](apis/alfred_sheets_workflow.js)
- [Exchange rates](apis/exchange_rates.js) · [Gender by name](apis/gender_by_name.js) · [Expand short URLs](apis/expand_short_url.js) · [Parallel API calls](apis/parallel_api_calls.js)

### [`utilities/`](utilities)

- [HMAC signatures](utilities/hmac_signature.js) · [Generate key pairs](utilities/generate_key_pair.js) · [Coupon codes](utilities/coupon_codes.js)
- [Language detection](utilities/language_detection.js) · [Transliteration](utilities/transliterate.js) · [Durations](utilities/duration.js)
- [Cron jobs](utilities/cron_jobs.js) · [Dynamic imports](utilities/dynamic-imports/start.js) · [Local IP](utilities/local_ip.js) · [List built-in modules](utilities/builtin_modules.js) · [npm cleanup](utilities/npm)

### [`node-basics/`](node-basics)

- [Essentials: events, streams, readline, timers, process](node-basics/essentials)
- [Callbacks → async/await](node-basics/callbacks_to_async.js) · [Modern JS features](node-basics/modern_js_features.js) · [TypeScript with plain `node`](node-basics/typescript)

### [`stackoverflow_answers/`](stackoverflow_answers)

[Promises in loops](stackoverflow_answers/loop-await/loop-await.js) · [Error handling](stackoverflow_answers/error-handling.js) · [finally](stackoverflow_answers/always-then.js) · [Deep copy a directory](stackoverflow_answers/copy-dir-deep.js) · [AES-256-GCM encryption](stackoverflow_answers/crypto-create-cipheriv.js) · [Nested plugin loading](stackoverflow_answers/require_nested/app.js) · [Streaming XML](stackoverflow_answers/xml-streamer/main.js) · [Resample WAV to 8 kHz](stackoverflow_answers/wav-8000hz/wav.js) · [and more](stackoverflow_answers)

### [`tips/`](tips/README.md)

One-liners and tips collected over the years.

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
