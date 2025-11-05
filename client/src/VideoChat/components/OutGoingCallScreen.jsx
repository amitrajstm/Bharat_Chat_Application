import React, { useContext, useEffect, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { VideoCallContext } from '../../Contexts/VideCallContext';
import useUserMedia from '../../hooks/useMediaStream';
import VideoWrapper from '../common/VideoWrapper';

const OutGoingCallScreen = ({ targetUser, chatId,setIsOpen }) => {
    const { myStream, startVideoCall,remoteVideoRef} = useContext(VideoCallContext);
    const { enableStream, toggleAudio, toggleVideo, disableStream,setIsMuted ,isMuted,camOn,setCamOn } = useUserMedia();

    useEffect(() => {
        if (!myStream) {
            enableStream();
        }
        // return () => disableStream();
    }, [enableStream, myStream]);

    const handleToggleMic = () => {
        setIsMuted((prev) => !prev);
        toggleAudio(!isMuted);
    };

    const handleToggleCam = () => {
        toggleVideo();
        setCamOn((prev) => !prev);
    };

    const onCancel = () => {
        setIsOpen(false);
        disableStream();
    };

    const onContinue = () => {
        startVideoCall({
            chatId: chatId,
            targetId: targetUser._id
        });

    };

    return (
        <div className="min-w-full h-[100vh] min-h-[700px] overflow-scroll md:grid gap-4 md:grid-cols-2 bg-white dark:bg-stone-800 p-4">
            <div className="bg-slate-100 m-4 max-w-2xl h-fit dark:bg-stone-700 rounded-lg p-3">
                <div className="bg-black min-">
                    <VideoWrapper stream={myStream} isMuted={isMuted} />
                </div>


                <div className="flex items-center justify-center gap-4 my-10">
                    {isMuted ? (
                        <FaMicrophoneSlash
                            onClick={handleToggleMic}
                            className="text-red-500 cursor-pointer text-3xl"
                        />
                    ) : (
                        <FaMicrophone
                            onClick={handleToggleMic}
                            className="text-blue-500 cursor-pointer text-3xl"
                        />
                    )}

                    {camOn ? (
                        <FaVideo
                            onClick={handleToggleCam}
                            className="text-blue-500 cursor-pointer text-3xl"
                        />
                    ) : (
                        <FaVideoSlash
                            onClick={handleToggleCam}
                            className="text-red-500 cursor-pointer text-3xl"
                        />
                    )}
                </div>


            </div>

            {/* User Details */}
            <div>

                <div className='p-4 mt-10'>
                    <h1 className='text-3xl font-bold'>Calling to : {targetUser?.fullName}</h1>
                    <p className='text-lg'>Email : {targetUser?.email}</p>
                    <p className='text-lg'>Username : {targetUser?.userName}</p>

                </div>

                <div className='flex gap-4 flex-wrap items-center my-3 px-3'>
                    <button
                        onClick={onContinue}
                        className='px-4 py-2  flex-grow font-bold rounded-full bg-blue-500 text-white  hover:bg-blue-600 transition'
                    >
                        Continue
                    </button>
                    <button
                        onClick={onCancel}
                        className='px-4 py-2 bg-red-500 flex-grow font-bold text-white rounded-full hover:bg-red-600 transition'
                    >
                        Cancel
                    </button>
                </div>

            </div>

        </div>
    );
};

export default OutGoingCallScreen;
