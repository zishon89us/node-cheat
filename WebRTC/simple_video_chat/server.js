// Signaling server for a 1:1 WebRTC video call. Media flows peer-to-peer;
// this server only relays SDP offers/answers and ICE candidates within a room.
// Run: npm install && npm start, then open http://localhost:3000/?room=demo in two tabs.

import { createServer } from 'node:http';
import { join } from 'node:path';
import express from 'express';
import { Server } from 'socket.io';

const ROOM_PATTERN = /^[\w-]{1,40}$/;

const app = express();
app.use(express.static(join(import.meta.dirname, 'public')));

const server = createServer(app);
const io = new Server(server, { maxHttpBufferSize: 64_000 });

io.on('connection', (socket) => {
  socket.on('join', async (room, ack) => {
    if (typeof ack !== 'function') return;
    if (typeof room !== 'string' || !ROOM_PATTERN.test(room)) return ack({ ok: false, error: 'Invalid room name' });

    const peers = await io.in(room).fetchSockets();
    if (peers.length >= 2) return ack({ ok: false, error: 'Room is full' });

    await socket.join(room);
    socket.data.room = room;
    ack({ ok: true, initiator: peers.length === 1 });
    socket.to(room).emit('peer-joined');
  });

  for (const event of ['offer', 'answer', 'ice-candidate']) {
    socket.on(event, (payload) => {
      if (socket.data.room) socket.to(socket.data.room).emit(event, payload);
    });
  }

  socket.on('disconnect', () => {
    if (socket.data.room) socket.to(socket.data.room).emit('peer-left');
  });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Open http://localhost:${port}/?room=demo in two browser tabs`));
