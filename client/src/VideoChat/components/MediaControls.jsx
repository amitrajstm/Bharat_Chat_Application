// /components/MediaControls.jsx
import React, { useContext } from "react";
import { VideoCallContext } from "../../Contexts/VideCallContext";

const MediaControls = () => {
  const { localStreamRef, endCall } = useContext(VideoCallContext);

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current.srcObject
      .getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current.srcObject
      .getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
  };

  return (
    <div className="controls">
      <button onClick={toggleVideo}>Toggle Video</button>
      <button onClick={toggleAudio}>Toggle Audio</button>
      <button onClick={endCall}>End Call</button>
    </div>
  );
};

export default MediaControls;
