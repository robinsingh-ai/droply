import { ExpressPeerServer } from 'peer';

export default function handler(req, res) {
  // Only allow WebSocket connections
  if (!res.socket.server.peerServer) {
    const peerServer = ExpressPeerServer(res.socket.server, {
      path: '/droply',
      allow_discovery: true,
      proxied: true,
      debug: 3,
    });

    res.socket.server.peerServer = peerServer;
  }

  // Handle the PeerJS connection
  res.socket.server.peerServer.handleRequest(req, res);
} 