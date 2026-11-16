// Vanilla JS client (no jQuery). User text is only ever set via textContent.
const TYPING_TIMER_LENGTH = 400;
const COLORS = [
  '#e21400',
  '#91580f',
  '#f8a700',
  '#f78b00',
  '#58dc00',
  '#287b00',
  '#a8f07a',
  '#4ae8c4',
  '#3b88eb',
  '#3824aa',
  '#a700ff',
  '#d300e7',
];

const usernameInput = document.querySelector('.usernameInput');
const messages = document.querySelector('.messages');
const inputMessage = document.querySelector('.inputMessage');
const loginPage = document.querySelector('.login.page');
const chatPage = document.querySelector('.chat.page');

const socket = io();

let username = '';
let connected = false;
let typing = false;
let lastTypingTime = 0;
let currentInput = usernameInput;
usernameInput.focus();

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function addMessageElement(node, { prepend = false } = {}) {
  if (prepend) messages.prepend(node);
  else messages.append(node);
  messages.scrollTop = messages.scrollHeight;
}

const log = (message, options) => addMessageElement(el('li', 'log', message), options);

const addParticipantsMessage = ({ numUsers }) =>
  log(numUsers === 1 ? "there's 1 participant" : `there are ${numUsers} participants`);

function getUsernameColor(name) {
  let hash = 7;
  for (const ch of name) hash = ch.codePointAt(0) + (hash << 5) - hash;
  return COLORS[Math.abs(hash % COLORS.length)];
}

const getTypingMessages = (name) =>
  [...messages.querySelectorAll('.typing.message')].filter(
    (node) => node.dataset.username === name,
  );

function addChatMessage({ username: from, message, typing: isTyping = false }) {
  getTypingMessages(from).forEach((node) => node.remove());

  const item = el('li', isTyping ? 'message typing' : 'message');
  item.dataset.username = from;
  const nameSpan = el('span', 'username', from);
  nameSpan.style.color = getUsernameColor(from);
  item.append(nameSpan, el('span', 'messageBody', message));
  addMessageElement(item);
}

const removeChatTyping = ({ username: from }) =>
  getTypingMessages(from).forEach((node) => node.remove());

function setUsername() {
  username = usernameInput.value.trim();
  if (!username) return;
  loginPage.style.display = 'none';
  chatPage.style.display = 'block';
  currentInput = inputMessage;
  inputMessage.focus();
  socket.emit('add user', username);
}

function sendMessage() {
  const message = inputMessage.value.trim();
  if (!message || !connected) return;
  inputMessage.value = '';
  addChatMessage({ username, message });
  socket.emit('new message', message);
}

function updateTyping() {
  if (!connected) return;
  if (!typing) {
    typing = true;
    socket.emit('typing');
  }
  lastTypingTime = Date.now();
  setTimeout(() => {
    if (Date.now() - lastTypingTime >= TYPING_TIMER_LENGTH && typing) {
      socket.emit('stop typing');
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
}

window.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey || event.metaKey || event.altKey)) currentInput.focus();
  if (event.key !== 'Enter') return;
  if (username) {
    sendMessage();
    socket.emit('stop typing');
    typing = false;
  } else {
    setUsername();
  }
});

inputMessage.addEventListener('input', updateTyping);
loginPage.addEventListener('click', () => currentInput.focus());

socket.on('login', (data) => {
  connected = true;
  log('Welcome to Socket.IO Chat – ', { prepend: true });
  addParticipantsMessage(data);
});
socket.on('new message', addChatMessage);
socket.on('user joined', (data) => {
  log(`${data.username} joined`);
  addParticipantsMessage(data);
});
socket.on('user left', (data) => {
  log(`${data.username} left`);
  addParticipantsMessage(data);
  removeChatTyping(data);
});
socket.on('typing', (data) => addChatMessage({ ...data, message: 'is typing', typing: true }));
socket.on('stop typing', removeChatTyping);
