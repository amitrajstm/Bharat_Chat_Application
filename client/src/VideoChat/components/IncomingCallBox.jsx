import React, { useContext, useEffect, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { VideoCallContext } from '../../Contexts/VideCallContext';
import useUserMedia from '../../hooks/useMediaStream';
import VideoWrapper from '../common/VideoWrapper';

const IncomingCallBox = ({caller, onAccept, onReject,incomingCall }) => {
    const { myStream, startVideoCall } = useContext(VideoCallContext);
    const { enableStream, toggleAudio, toggleVideo, disableStream } = useUserMedia();
    const [isMuted, setIsMuted] = useState(false);
    const [camOn, setCamOn] = useState(true);
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

   

    return (
        <div className="min-w-full h-[100vh] min-h-[700px] overflow-scroll md:grid gap-4 md:grid-cols-2 bg-white dark:bg-stone-800 p-4">
            <div className="bg-slate-100 m-4 max-w-2xl h-fit dark:bg-stone-700 rounded-lg p-3">
                <div className="bg-black ">
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
                    <h1 className='text-3xl font-bold'>Call From : {caller?.fullName}</h1>
                    <p className='text-lg'>Email : {caller?.email}</p>
                    <p className='text-lg'>Username : {caller?.userName}</p>

                </div>

                <div className='flex gap-4 flex-wrap items-center my-3 px-3'>
                    <button
                        onClick={onAccept}
                        className='px-4 py-2  flex-grow font-bold rounded-full bg-green-500 text-white  hover:bg-blue-600 transition'
                    >
                        Accept
                    </button>
                    <button
                        onClick={onReject}
                        className='px-4 py-2 bg-red-500 flex-grow font-bold text-white rounded-full hover:bg-red-600 transition'
                    >
                        Decline
                    </button>
                </div>

            </div>

        </div>
    );
};

export default IncomingCallBox;
