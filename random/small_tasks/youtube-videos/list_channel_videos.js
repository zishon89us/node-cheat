//------------------------------------------------------
// List the latest videos of a YouTube channel (YouTube Data API v3)
// Web Link=> https://developers.google.com/youtube/v3/docs/search/list
// Run: YOUTUBE_API_KEY=... node list_channel_videos.js <channelId>
//------------------------------------------------------

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) throw new Error('Set YOUTUBE_API_KEY');

const channelId = process.argv[2] ?? 'UC_x5XG1OV2P6uZZ5FSM9Ttw';
if (!/^UC[\w-]{22}$/.test(channelId))
  throw new Error('Expected a channel id like UCxxxxxxxxxxxxxxxxxxxxxx');

const url = new URL('https://www.googleapis.com/youtube/v3/search');
url.search = new URLSearchParams({
  part: 'snippet',
  channelId,
  type: 'video',
  order: 'date',
  maxResults: '10',
  key: apiKey,
});

const res = await fetch(url);
if (!res.ok) throw new Error(`YouTube API responded ${res.status}`);

const { items } = await res.json();
for (const { id, snippet } of items) {
  console.log(
    `${snippet.publishedAt.slice(0, 10)}  https://youtu.be/${id.videoId}  ${snippet.title}`,
  );
}
