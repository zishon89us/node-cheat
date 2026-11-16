# HTTPS examples

Private keys are never committed. Generate a local self-signed pair (valid for `localhost` only):

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365 \
  -keyout key.pem -out cert.pem -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Then run either server:

```bash
SSL_KEY_PATH=./key.pem SSL_CERT_PATH=./cert.pem node web/https/basic_https/server.js
SSL_KEY_PATH=./key.pem SSL_CERT_PATH=./cert.pem node web/https/express_https/server.js
```

In production, use certificates from a CA (e.g. Let's Encrypt) or terminate TLS at a reverse proxy / load balancer.
