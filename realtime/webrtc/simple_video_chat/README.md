# WebRTC | simple video chat

1:1 video call using only browser WebRTC APIs (`getUserMedia`, `RTCPeerConnection`). A tiny Socket.IO server relays the signaling messages (SDP offer/answer and ICE candidates); audio/video goes directly between the browsers.

```bash
npm install
npm start
# open http://localhost:3000/?room=demo in two tabs (or two devices on the same network)
```

Browsers only allow camera access on `localhost` or HTTPS. For calls across restrictive NATs you need a TURN server (e.g. coturn) in `rtcConfig.iceServers`.
