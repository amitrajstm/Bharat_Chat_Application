// /components/CallButton.jsx
import React, { useContext } from "react";
import useSocket from "../../hooks/useSocket";
import { VideoCallContext } from "../../Contexts/VideCallContext";

const CallButton = ({ targetId }) => {
    const { localStreamRef, remoteStreamRef, peer } = useContext(VideoCallContext);
    const socket = useSocket();

    const startCall = () => {
        const call = peer.call(targetId, localStreamRef.current.srcObject);
        
        // Listen for the remote stream
        call.on("stream", (remoteStream) => {
            if (remoteStreamRef.current) {
                remoteStreamRef.current.srcObject = remoteStream;
            }
        });

        // Emit start call event through socket
        socket.emit("startCall", { to: targetId });
    };

    return <button onClick={startCall}>Start Call</button>;
};

export default CallButton;
