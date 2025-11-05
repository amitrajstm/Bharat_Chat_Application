import React, { useContext, useState } from 'react';
import useUserMedia from './useMediaStream';
import { useSocket } from '../Contexts/SocketProvider';
import { userData } from '../atoms/state';
import { useRecoilState } from 'recoil';
import { VideoCallContext } from '../Contexts/VideCallContext';

const UseMediaControls = () => {

    const { setIsMuted, isMuted, camOn, setCamOn } = useUserMedia();
    const { socket } = useSocket();
    const [currUser] = useRecoilState(userData);
    const { roomId, myStream, localStreamRef } = useContext(VideoCallContext);

    // toggle mic and video
    const handleToggleAudio = () => {
        setIsMuted(!isMuted);
        myStream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled
        })
        socket?.emit('toggleAudio', { micStatus:isMuted, roomId });

    }
    const handleToggleVideo = () => {
        setCamOn(!camOn);

        const videoTrack = localStreamRef.current?.getVideoTracks()[0] || myStream?.getVideoTracks()[0];
console.log(localStreamRef)
       myStream ? myStream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled
        }) : localStreamRef.current?.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled
        }); 

        if (videoTrack && videoTrack.enabled) {
            videoTrack.enabled = false;
            videoTrack.stop();
            
        } else {
            videoTrack.enabled = true;
            videoTrack?.play();
        }
        socket?.emit('toggleVideo', { camStaus:camOn, roomId });
    }





    return (
        {
            handleToggleAudio,
            handleToggleVideo,

        }
    );
}

export default UseMediaControls;
