//------------------------------------------------------
// Fan out dependent API calls with async/await + Promise.all
// (replaces an async.waterfall/async.parallel callback pyramid)
// 1. fetch upcoming events for an artist (Bandsintown)
// 2. fetch the weather forecast for every venue in parallel (OpenWeatherMap)
// Run: BANDSINTOWN_APP_ID=... OPENWEATHER_API_KEY=... node async.js "Coldplay"
//------------------------------------------------------

const { BANDSINTOWN_APP_ID, OPENWEATHER_API_KEY } = process.env;
if (!BANDSINTOWN_APP_ID || !OPENWEATHER_API_KEY) {
  throw new Error('Set BANDSINTOWN_APP_ID and OPENWEATHER_API_KEY');
}

const getJson = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${url.hostname} responded ${res.status}`);
  return res.json();
};

const eventsUrl = (artist) => {
  const url = new URL(`https://rest.bandsintown.com/artists/${encodeURIComponent(artist)}/events`);
  url.searchParams.set('app_id', BANDSINTOWN_APP_ID);
  return url;
};

const forecastUrl = (lat, lon) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
  url.search = new URLSearchParams({ lat, lon, units: 'metric', appid: OPENWEATHER_API_KEY });
  return url;
};

export const getEventsWithWeather = async (artist) => {
  const events = await getJson(eventsUrl(artist));

  // allSettled: one failed forecast should not drop every event
  const forecasts = await Promise.allSettled(
    events.map(({ venue }) => getJson(forecastUrl(venue.latitude, venue.longitude))),
  );

  return events.map((event, i) => {
    const forecast = forecasts[i].status === 'fulfilled' ? forecasts[i].value.list[0] : null;
    return {
      datetime: event.datetime,
      venue: event.venue.name,
      city: event.venue.city,
      weather: forecast && {
        datetime: forecast.dt_txt,
        temp: forecast.main.temp,
        humidity: forecast.main.humidity,
        description: forecast.weather[0].description,
      },
    };
  });
};

if (process.argv[1] === import.meta.filename) {
  const artist = process.argv[2] ?? 'Coldplay';
  console.log(await getEventsWithWeather(artist));
}
