/*
const _something = {
    x: () => {
        _something.y("hello world");
    },
    y: (text) => {
        console.log(text);
    },
};

module.exports = _something;*/

const path = require('path');
const fs = require('fs');

function readStream(file) {
    console.log("starte lesen");
    const readStream = fs.createReadStream(file);
    readStream.setEncoding('utf8');
    return new Promise((resolve, reject) => {
        let data = "";
        readStream.on("data", chunk => data += chunk);
        readStream.on("end", () => {console.log(data); resolve(data);});
        readStream.on("error", error => reject(error));
    });
}

async function main() {
    const xml = await readStream( path.resolve(__dirname, 'files', 'test.xml'));
    console.log(xml);
}

main();