// One-to-one + group chat with Socket.IO v4
// Run: npm install && npm start

import { createServer } from 'node:http';
import { join } from 'node:path';
import express from 'express';
import { Server } from 'socket.io';

const NAME_PATTERN = /^[\p{L}\p{N}_ -]{1,20}$/u;
const MAX_MESSAGE_LENGTH = 500;

const app = express();
app.use(express.static(join(import.meta.dirname, 'public')));

const server = createServer(app);
const io = new Server(server, { maxHttpBufferSize: 10_000 });

const users = new Map(); // name -> socket id
const userList = () => [...users.keys()];
const cleanText = (value) => (typeof value === 'string' ? value.trim().slice(0, MAX_MESSAGE_LENGTH) : '');

io.on('connection', (socket) => {
  socket.emit('users', userList());

  socket.on('join', (rawName, ack) => {
    if (typeof ack !== 'function') return;
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (socket.data.name) return ack({ ok: false, error: 'You already joined.' });
    if (!NAME_PATTERN.test(name)) return ack({ ok: false, error: 'Use 1-20 letters, numbers, spaces, _ or -.' });
    if (users.has(name)) return ack({ ok: false, error: 'This name is already taken.' });

    socket.data.name = name;
    users.set(name, socket.id);
    ack({ ok: true });
    io.emit('announcement', `${name} joined the chat`);
    io.emit('users', userList());
  });

  socket.on('text', (rawText) => {
    const text = cleanText(rawText);
    if (!socket.data.name || !text) return;
    socket.broadcast.emit('text', { from: socket.data.name, text, at: Date.now() });
  });

  socket.on('private', (payload) => {
    const to = typeof payload?.to === 'string' ? payload.to : '';
    const text = cleanText(payload?.text);
    const targetId = users.get(to);
    if (!socket.data.name || !text || !targetId) return;
    io.to(targetId).emit('private', { from: socket.data.name, text, at: Date.now() });
  });

  socket.on('disconnect', () => {
    const { name } = socket.data;
    if (!name) return;
    users.delete(name);
    io.emit('announcement', `${name} left the chat`);
    io.emit('users', userList());
  });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Chat listening on http://localhost:${port}`));
