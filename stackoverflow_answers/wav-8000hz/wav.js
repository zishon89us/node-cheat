//------------------------------------------------------
//Change Wav Sampel Rate -
//Web Link=> https://stackoverflow.com/questions/60426885/how-to-convert-wav-file-into-8000hz-using-nodejs/60427748#60427748
//Run : node wav.js
//------------------------------------------------------


const fs = require('fs');
const WaveFile = require('wavefile').WaveFile;

let wav = new WaveFile(fs.readFileSync("440Hz_44100Hz_16bit_05sec.wav"));

// do it like this
wav.toSampleRate(8000);

// or like following way with your choice method
// wav.toSampleRate(44100, {method: "cubic"});

// Write the new 44.1kHz file
fs.writeFileSync("target-file.wav", wav.toBuffer());
