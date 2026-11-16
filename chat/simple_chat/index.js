// Simple group chat with typing indicators (Socket.IO v4)
// Run: npm install && npm start

import { createServer } from 'node:http';
import { join } from 'node:path';
import express from 'express';
import { Server } from 'socket.io';

const NAME_PATTERN = /^[\p{L}\p{N}_ -]{1,14}$/u;
const MAX_MESSAGE_LENGTH = 500;

const app = express();
app.use(express.static(join(import.meta.dirname, 'public')));

const server = createServer(app);
const io = new Server(server, { maxHttpBufferSize: 10_000 });

let numUsers = 0;

io.on('connection', (socket) => {
  socket.on('add user', (rawName) => {
    const username = typeof rawName === 'string' ? rawName.trim() : '';
    if (socket.data.username || !NAME_PATTERN.test(username)) return;

    socket.data.username = username;
    numUsers += 1;
    socket.emit('login', { numUsers });
    socket.broadcast.emit('user joined', { username, numUsers });
  });

  socket.on('new message', (rawMessage) => {
    const message = typeof rawMessage === 'string' ? rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
    if (!socket.data.username || !message) return;
    socket.broadcast.emit('new message', { username: socket.data.username, message });
  });

  socket.on('typing', () => {
    if (socket.data.username) socket.broadcast.emit('typing', { username: socket.data.username });
  });

  socket.on('stop typing', () => {
    if (socket.data.username) socket.broadcast.emit('stop typing', { username: socket.data.username });
  });

  socket.on('disconnect', () => {
    if (!socket.data.username) return;
    numUsers -= 1;
    socket.broadcast.emit('user left', { username: socket.data.username, numUsers });
  });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
