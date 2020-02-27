const fs = require('fs');

module.exports.readStream = function (file) {
    console.log("read stream started");
    const readStream = fs.createReadStream(file);
    readStream.setEncoding('utf8');
    return new Promise((resolve, reject) => {
        let data = "";
        readStream.on("data", chunk => data += chunk);
        readStream.on("end", () => {console.log(data); resolve(data);});
        readStream.on("error", error => reject(error));
    });
}