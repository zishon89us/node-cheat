# Security Policy

## Scope

The code in this repository consists of educational examples. Each one is kept minimal, so none of them is a hardened production service. Treat every example as a starting point: review it, add authentication where it is needed, and set your own secrets.

## Reporting a vulnerability

Please do not open a public issue for security problems. Report them privately with GitHub's **Report a vulnerability** button on the repository's Security tab. Include the file path and a short description or proof of concept.

You should get a response within 7 days.

## Secrets

Credentials are never committed. Every example reads them from environment variables (see `.env.example`). If you find a real credential in the repository or its history, report it as described above.
