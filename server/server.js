const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: 9000,
  path: '/droply',
  debug: 3,
});

console.log('PeerJS server running on http://localhost:9000/droply'); 