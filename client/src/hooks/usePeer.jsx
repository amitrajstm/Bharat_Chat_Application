import { useState, useEffect, useRef } from "react";
import Peer from 'peerjs';
export default function usePeer() {
  const [myPeerId, setMyPeerId] = useState(null);
  const peerRef = useRef(null); 

  useEffect(() => {
    let isMounted = true; 
      try {
        const newPeer = new Peer();

        peerRef.current = newPeer;

        newPeer.on("open", (id) => {
          if (isMounted) {
            // console.log("Peer initialized with ID:", id);
            setMyPeerId(id);
          }
        });

        newPeer.on("disconnected", () => {
          // console.warn("Peer disconnected. Attempting reconnection...");
          newPeer.reconnect();
        });

        newPeer.on("close", () => {
          // console.log("Peer connection closed.");
        });

        newPeer.on("error", (error) => {
          // console.log(error)
          // console.error("Peer error:");
        });

      } catch (error) {
        // console.error("Error initializing PeerJS:", error);
      }

    return () => {
      isMounted = false;
    };
  }, []);
  
  return {
    peer: peerRef.current,
    myPeerId,
  };
}
