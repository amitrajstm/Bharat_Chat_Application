import { PeerServer } from "peer";

const peerServer = PeerServer({
  port: 9000,  
  path: '/peerjs',
  allow_discovery: true,  
});

export default peerServer;