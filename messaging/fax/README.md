# Fax

`send_fax.js` sends a PDF as a fax through the [Telnyx Programmable Fax API](https://developers.telnyx.com/docs/programmable-fax) with plain `fetch`, no SDK needed.

```bash
export TELNYX_API_KEY=KEY...
export TELNYX_FAX_CONNECTION_ID=...   # a Fax Application / connection in the Telnyx portal
export TELNYX_FAX_FROM=+15550001111   # a fax-enabled Telnyx number
node send_fax.js +15551234567 https://example.com/document.pdf
```

The document must be reachable over public HTTPS. Telnyx reports delivery status through webhooks on the fax application.
