import { useContext, useCallback, useEffect } from "react";
import { VideoCallContext } from "../Contexts/VideCallContext";

const userMediaConfig = {
  audio: { echoCancellation: true, noiseSuppression: true },
  video: { facingMode: "user" },
};

export default function useUserMedia() {
  const { myStream, localStreamRef,setMyStream,isMuted, setIsMuted ,camOn, setCamOn} = useContext(VideoCallContext);

  useEffect(() => {
    localStreamRef.current = myStream;
  }, [localStreamRef, myStream]);

  const enableStream = useCallback(async (audioConfig) => {
    if (localStreamRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia(!audioConfig ?userMediaConfig :
        audioConfig
      );
      setMyStream(stream);
    } catch (error) {
      console.error("Failed to get user media:", error);
    }
  }, [localStreamRef, setMyStream]);

  const toggleAudio = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
  }, [localStreamRef]);

  const toggleVideo = useCallback(async () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];

    if (videoTrack && videoTrack.enabled) {
      videoTrack.enabled = false;
      videoTrack.stop(); 
    } else {
      try {
        const newVideoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          
        });
        const newVideoTrack = newVideoStream.getVideoTracks()[0];

        localStreamRef.current?.getVideoTracks().forEach((track) => track.stop());

        const newStream = new MediaStream([
          ...localStreamRef.current.getAudioTracks(),
          newVideoTrack,
        ]);
        setMyStream(newStream);
      } catch (error) {
        console.error("Failed to start video:", error);
      }
    }
  }, [localStreamRef, setMyStream]);

  const disableStream = useCallback(() => {   
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
  }, [localStreamRef, setMyStream]);

  return { enableStream, toggleAudio, toggleVideo, disableStream,
    isMuted, setIsMuted,camOn,setCamOn
   };
}
