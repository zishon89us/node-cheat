//------------------------------------------------------
// Expand a shortened URL by following its redirects
// (the goo.gl API used originally has been shut down)
// Run: node long_url.js [shortUrl]
//------------------------------------------------------

const expandUrl = async (shortUrl) => {
  const url = new URL(shortUrl);
  if (url.protocol !== 'https:' && url.protocol !== 'http:')
    throw new Error('Only http(s) URLs are supported');

  // HEAD avoids downloading the target page; some shorteners only answer GET
  const res = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    signal: AbortSignal.timeout(10_000),
  });
  return res.url;
};

const shortUrl = process.argv[2] ?? 'https://youtu.be/90AiXO1pAiA';
console.log('Long url is', await expandUrl(shortUrl));
