//------------------------------------------------------
// Get the local IP address(es) of the machine running the app
// Web Link=> http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
// Run: node my-ip.js
//------------------------------------------------------

import { networkInterfaces } from 'node:os';

const addresses = Object.values(networkInterfaces())
  .flat()
  .filter((iface) => !iface.internal);

console.log(
  'IPv4:',
  addresses.filter((a) => a.family === 'IPv4').map((a) => a.address),
);
console.log(
  'IPv6:',
  addresses.filter((a) => a.family === 'IPv6').map((a) => a.address),
);

// The `ip` package used before has unpatched SSRF advisories (CVE-2024-29415); the built-in API is enough.
