const _streamer = require('./xml-streamer');

async function main() {
    const xml = await readStream( path.resolve(__dirname, 'test.xml'));
    console.log(xml);
}

main();