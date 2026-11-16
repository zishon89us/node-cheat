const statusEl = document.getElementById('status');
const localVideo = document.getElementById('local');
const remoteVideo = document.getElementById('remote');
const setStatus = (text) => (statusEl.textContent = text);

const room = new URLSearchParams(location.search).get('room') ?? 'demo';
const socket = io();
let pc;
let localStream;

// Public STUN is fine for demos; production needs your own TURN server for strict NATs.
const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

function createPeerConnection() {
  pc = new RTCPeerConnection(rtcConfig);
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  pc.addEventListener('icecandidate', ({ candidate }) => candidate && socket.emit('ice-candidate', candidate));
  pc.addEventListener('track', ({ streams: [stream] }) => (remoteVideo.srcObject = stream));
  pc.addEventListener('connectionstatechange', () => setStatus(`Connection: ${pc.connectionState}`));
}

async function makeOffer() {
  await pc.setLocalDescription(await pc.createOffer());
  socket.emit('offer', pc.localDescription);
}

socket.on('peer-joined', async () => {
  setStatus('Peer joined, calling…');
  createPeerConnection();
  await makeOffer();
});

socket.on('offer', async (offer) => {
  if (!pc) createPeerConnection();
  await pc.setRemoteDescription(offer);
  await pc.setLocalDescription(await pc.createAnswer());
  socket.emit('answer', pc.localDescription);
});

socket.on('answer', (answer) => pc?.setRemoteDescription(answer));
socket.on('ice-candidate', (candidate) => pc?.addIceCandidate(candidate).catch(console.error));

socket.on('peer-left', () => {
  pc?.close();
  pc = undefined;
  remoteVideo.srcObject = null;
  setStatus('Peer left. Waiting for someone to join…');
});

try {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  socket.emit('join', room, ({ ok, error, initiator }) => {
    if (!ok) return setStatus(error);
    setStatus(initiator ? 'Joined; connecting to peer…' : `Waiting for someone to join room "${room}"…`);
  });
} catch (err) {
  setStatus(`Camera/microphone unavailable: ${err.message}`);
}
