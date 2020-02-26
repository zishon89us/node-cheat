const path = require('path');
const _streamer = require('./xml-streamer');

async function main() {
    const xml = await _streamer.readStream( path.resolve(__dirname, 'files', 'test.xml'));
    console.log(xml);
}

main();
