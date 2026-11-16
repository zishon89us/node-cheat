// Minimal client for the SendGrid v3 Web API using global fetch. Env: SENDGRID_API_KEY.
// onBehalfOf lets a parent account act as one of its subusers.

export async function sendgridApi(method, path, { body, onBehalfOf } = {}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('Missing environment variable SENDGRID_API_KEY');

  const res = await fetch(`https://api.sendgrid.com/v3${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(onBehalfOf && { 'on-behalf-of': onBehalfOf }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail = data?.errors?.map((e) => e.message).join('; ') ?? res.statusText;
    throw new Error(`SendGrid ${method} ${path} failed (${res.status}): ${detail}`);
  }
  return data;
}
