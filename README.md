# node-cheat

> **⚠️ ARCHIVED - Educational Reference Only (2016-2018)**  
> This repository is preserved as a historical reference. For modern Node.js examples and AI-powered security scanning, see **[SecureAI](./secureai)** →

---

## 🎯 Looking for Modern Code?

**Check out [SecureAI](./secureai)** - A production-ready, AI-powered security scanner built with 2026 best practices:
- ✅ TypeScript + Modern Node.js patterns
- ✅ AI integration with Claude API
- ✅ GitHub App for automated security scanning
- ✅ Production-ready architecture
- ✅ Comprehensive testing & documentation

---

## 📚 Legacy Content (2016-2018)

This repository contains Node.js code examples from 2016-2018. While the concepts remain relevant, the implementation patterns and dependencies are outdated.

### ⚠️ Important Security Warnings

| Issue | Impact | Action Required |
|-------|--------|-----------------|
| **Outdated Dependencies** | Known CVEs, security vulnerabilities | Update to latest versions |
| **Old Patterns** | Callbacks instead of async/await | Modernize to promises/async-await |
| **Hardcoded Examples** | May include example API keys | Use environment variables |
| **Missing Validation** | No input sanitization | Add validation layers |
| **Deprecated Packages** | No longer maintained | Find modern alternatives |

### ✅ Before Using Any Code

1. **Update dependencies**: Run `npm update` and check for breaking changes
2. **Security audit**: Run `npm audit fix` and review advisories
3. **Use environment variables**: Never hardcode credentials (see `.env.example`)
4. **Modernize patterns**: Convert callbacks to async/await
5. **Add validation**: Implement input validation and error handling
6. **Test thoroughly**: Add comprehensive tests before production use

### 🔗 Recommended Modern Resources

- **Official Docs**: [Node.js](https://nodejs.org/docs/) | [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Modern Examples**: [30 Seconds of Code](https://www.30secondsofcode.org/js/p/1)
- **Package Docs**: [Express](https://expressjs.com/) | [AWS SDK v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- **Security**: [OWASP](https://owasp.org/) | [Snyk Advisor](https://snyk.io/advisor/)
- **AI Tools**: ChatGPT, GitHub Copilot, Claude for current best practices

---

## 📖 Content Index

<details>
<summary><b>☁️ AWS Integration</b></summary>

- [CRUD S3 buckets](./aws/s3/create_bucket.js)
- Direct upload to S3 without local storage ([ES6](./aws/express_multer_s3/app_es8.js) | [ES5](./aws/express_multer_s3/app.js))
- [Upload using multer-s3](./aws/express_multer_s3)
- [Upload from base64 data](./aws/s3/upload_base_64.js)
- [AWS Step Functions](./aws/step-functions/app.js) *(WIP)*
- [Lambda Functions](./aws/lambda)
- [SQS Service Worker](./aws/sqs_service_worker)

</details>

<details>
<summary><b>🎥 WebRTC</b></summary>

- [Simple Video Chat](./WebRTC/simple_video_chat)
- [Tokbox Video Chat](./WebRTC/tokbox_video_chat)
- [Vidyo.io Chat (ES6)](./WebRTC/vidyo-io_chat)

</details>

<details>
<summary><b>💬 Chat Applications</b></summary>

- [Socket.io One-to-One Chat](./chat/one_one_chat)
- [Socket.io Simple Chat Server](./chat/simple_chat/index.js)

</details>

<details>
<summary><b>💳 Payment Gateways</b></summary>

- [Stripe Full Integration](./payments/stripe_one_time_payment)
  - Immediate charge, customer management
  - Add/delete cards
  - Authorize & capture
  - Token creation

</details>

<details>
<summary><b>📧 Communication</b></summary>

**Email**
- [SendGrid Integration (ES6)](./send_emails/send_grid.js)
- [Email Templates Module](./send_emails/)

**SMS**
- [Twilio SMS (ES6)](./send_sms/twillio_sms.js)

**Fax**
- Phaxio API *(Planned)*

</details>

<details>
<summary><b>🚀 Express.js</b></summary>

- [API Methods & Routes](./express)
- [Forever Process Management](./express)
- [GZIP Compression](./express)
- [HTTPS Server Setup](./https)

</details>

<details>
<summary><b>📁 File Operations</b></summary>

- [Read file line-by-line (tail module)](./files/line_by_line.js)
- [Read file line-by-line (fs + async)](./files/line_by_line.js)
- [Read multiple files (async)](./files/read_dir_files.js)
- [Download via Express](./files/express_server_download_file)
- [Download via HTTP](./files/download_file_http_server)

</details>

<details>
<summary><b>🗄️ Databases</b></summary>

- [GridFS Direct Upload](./gridfs/direct_upload_gridfs)
- [MongoDB Operations](./mongodb)
- [Redis Integration](./redis)

</details>

<details>
<summary><b>📄 PDF & Media</b></summary>

- [PDF in Browser](./pdf/pdf_browser)
- [FFmpeg Video Processing](./ffmpeg)

</details>

<details>
<summary><b>🛠️ Utilities</b></summary>

**Popular Utilities:**
- [Gender Detection by Name](./random/small_tasks/gender_by_name.js)
- [Exchange Rate API](./random/small_tasks/exchange_api.js)
- [Twitter Search](./random/small_tasks/search_tweets.js)
- [Google Spreadsheet Reader](./random/tiny_useful_modules/google_spreadsheets.js)
- [Coupon/Voucher Generator](./random/tiny_useful_modules/coupon-code.js)
- [URL Expander (short → long)](./random/tiny_useful_modules/long_url.js)
- [Website Screenshots](./random/tiny_useful_modules/screenshot.js)
- [YouTube Downloader (ES6)](./random/small_tasks/youtube-videos/download_script.js)
- [Cron Jobs (ES6 | ES5)](./random/small_tasks/cron-jobs/)
- [Image Size Detection](./random/tiny_useful_modules/image_size_probability.js)
- [Language Detection](./random/tiny_useful_modules/language_detection.js)
- [HMAC Signature](./random/tiny_useful_modules/hmac_signature.js)

**Authentication:**
- [Twitter/Facebook Auth](./random/small_tasks/twitter-facebook-auth-data)

**More:**
- [Awesome One-Liners](./awsome)
- [String Transliteration (ES6 | ES5)](./string/)
- [NPM Bulk Uninstall](./random/small_tasks/uninstall_all_packages/)

</details>

---

## 🤝 Contributing

This repository is **archived** and not accepting new code examples. However:

- **Bug Reports**: Security issues or broken examples → [Open an issue](https://github.com/zishon89us/node-cheat/issues)
- **Modern Alternatives**: Know a better 2026 solution? Share in discussions
- **SecureAI**: Contribute to the [SecureAI project](./secureai) for modern code

---

## 📊 Repository Stats

- **Created**: 2016
- **Archived**: 2025
- **Total Examples**: 100+
- **Dependencies**: 94 packages (⚠️ many outdated)
- **Security Issues**: 21 known vulnerabilities in dependencies

---

## 📜 License

ISC (see `package.json`)

---

## 🔗 Connect

**Author**: Zeeshan Hassan Memon  
**GitHub**: [@zishon89us](https://github.com/zishon89us)

---

<div align="center">

**Looking for production-ready code?**  
Check out **[SecureAI →](./secureai)**

</div>
