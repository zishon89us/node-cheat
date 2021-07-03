//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node events
//------------------------------------------------------


// events are node.js implementaton of pub/sub mechanism
const events = require('events');
const emitter = new events.EventEmitter();



emitter.on('someEvent', data => {
	console.log(`Yes - event has been raised:: ${data}`);
});

emitter.emit('someEvent', 'Hello from node-cheat!');
