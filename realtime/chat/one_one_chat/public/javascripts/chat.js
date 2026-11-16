// All user-supplied text is rendered with textContent, never innerHTML.
const socket = io();
const $ = (id) => document.getElementById(id);

let users = [];
let myName = '';

const formatTime = (at) => new Date(at).toLocaleTimeString();

function addMessage({ from, text, at = Date.now(), kind = 'public' }) {
  const li = document.createElement('li');
  li.className = `message ${kind}`;

  const header = document.createElement('div');
  header.className = 'meta';
  const who = document.createElement('strong');
  who.textContent = kind === 'private' ? `${from} (private)` : from;
  const time = document.createElement('time');
  time.dateTime = new Date(at).toISOString();
  time.textContent = formatTime(at);
  header.append(who, ' ', time);

  const body = document.createElement('p');
  body.textContent = text;

  li.append(header, body);
  $('messages').append(li);
  li.scrollIntoView({ block: 'end' });
}

function addAnnouncement(text) {
  const li = document.createElement('li');
  li.className = 'announcement';
  li.textContent = text;
  $('messages').append(li);
}

function renderUsers() {
  $('online-users').replaceChildren(
    ...users.map((name) => {
      const li = document.createElement('li');
      li.textContent = name === myName ? `${name} (you)` : name;
      return li;
    }),
  );
  $('private-to').replaceChildren(
    ...users
      .filter((name) => name !== myName)
      .map((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        return option;
      }),
  );
}

socket.on('users', (list) => {
  users = Array.isArray(list) ? list : [];
  renderUsers();
});
socket.on('announcement', addAnnouncement);
socket.on('text', (msg) => addMessage(msg));
socket.on('private', (msg) => addMessage({ ...msg, kind: 'private' }));

$('join-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('name-box').value.trim();
  socket.emit('join', name, ({ ok, error }) => {
    if (!ok) {
      $('join-error').textContent = error;
      return;
    }
    myName = name;
    $('join-form').hidden = true;
    $('chat-area').hidden = false;
    renderUsers();
    $('message-input').focus();
  });
});

$('message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = $('message-input').value.trim();
  if (!text) return;
  socket.emit('text', text);
  addMessage({ from: 'me', text });
  $('message-input').value = '';
});

$('private-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const to = $('private-to').value;
  const text = $('private-input').value.trim();
  if (!to || !text) return;
  socket.emit('private', { to, text });
  addMessage({ from: `me → ${to}`, text, kind: 'private' });
  $('private-input').value = '';
});
