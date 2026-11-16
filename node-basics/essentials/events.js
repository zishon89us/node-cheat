//------------------------------------------------------
// Node.js essentials: EventEmitter (pub/sub)
// Run: node events.js
//------------------------------------------------------

import { EventEmitter, once } from 'node:events';

const emitter = new EventEmitter();

emitter.on('someEvent', (data) => {
  console.log(`Yes - event has been raised:: ${data}`);
});

emitter.emit('someEvent', 'Hello from node-cheat!');

// Await a single event as a promise
setTimeout(() => emitter.emit('ready', 42), 100);
const [value] = await once(emitter, 'ready');
console.log(`ready fired with ${value}`);
