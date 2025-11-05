import React, { useContext } from "react";
import VideoWrapper from "./common/VideoWrapper";
import { VideoCallContext } from "../Contexts/VideCallContext";
import Loader from "../common/Loader";
import {
  MdCallEnd,
  MdMicOff,
  MdOutlineScreenShare,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { IoMdMic } from "react-icons/io";
import UseMediaControls from "../hooks/useMediaControls";

const VideoCallInterfaceModal = () => {
  const {
    remoteStream,
    myStream,
    localStreamRef,
    handleOnClickCallEnd,
    isMuted,
    camOn,
  } = useContext(VideoCallContext);

  const { handleToggleAudio, handleToggleVideo } = UseMediaControls();

  return (
    <div className="bg-slate-100 dark:bg-stone-800 p-4 h-full w-full text-gray-900 dark:text-gray-200 flex flex-col-reverse md:grid md:grid-cols-4 gap-4">
      {/* Remote Video Section */}
      <div className="relative col-span-4 md:col-span-3 h-[60vh] md:h-full rounded-lg overflow-hidden">
        {remoteStream ? (
          <VideoWrapper stream={remoteStream} isMuted={false} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        )}

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-4 flex justify-around md:justify-center gap-4 px-2 md:px-8">
          {isMuted ? (
            <MdMicOff
              onClick={handleToggleAudio}
              className="text-4xl text-white bg-gray-500 hover:bg-gray-600 rounded-full p-2 cursor-pointer"
            />
          ) : (
            <IoMdMic
              onClick={handleToggleAudio}
              className="text-4xl text-white bg-gray-500 hover:bg-gray-600 rounded-full p-2 cursor-pointer"
            />
          )}

          {camOn ? (
            <MdVideocam
              onClick={handleToggleVideo}
              className="text-4xl text-white bg-gray-500 hover:bg-gray-600 rounded-full p-2 cursor-pointer"
            />
          ) : (
            <MdVideocamOff
              onClick={handleToggleVideo}
              className="text-4xl text-white bg-gray-500 hover:bg-gray-600 rounded-full p-2 cursor-pointer"
            />
          )}

          <MdCallEnd
            onClick={handleOnClickCallEnd}
            className="text-4xl text-white bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer"
          />
        </div>
      </div>

      {/* Local Video Section */}
      <div className="relative col-span-4 md:col-span-1 h-40 md:h-auto rounded-lg overflow-hidden">
        <div className="h-full md:h-fit absolute bottom-2 rounded-lg overflow-clip w-full">
          {myStream || localStreamRef?.current ? (
            <VideoWrapper
              stream={myStream || localStreamRef.current}
              isMuted={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterfaceModal;


// import React, { useContext, useEffect, useState } from 'react';
// import VideoWrapper from './common/VideoWrapper';
// import { VideoCallContext } from '../Contexts/VideCallContext';
// import Loader from '../common/Loader';
// import {
//     MdCallEnd, MdMicOff, MdOutlineScreenShare,
//     MdVideocam, MdVideocamOff
// } from "react-icons/md";
// import { IoMdMic } from 'react-icons/io';
// import useUserMedia from '../hooks/useMediaStream';
// import UseMediaControls from '../hooks/useMediaControls';

// const VideoCallInterfaceModal = () => {
//     const { remoteStream,remoteVideoRef,
//         handleOnClickCallEnd,
//         myStream, localStreamRef, isMuted, camOn, partnerMicStatus, partnerCamStatus } = useContext(VideoCallContext);
//     const { handleToggleAudio, handleToggleVideo } = UseMediaControls()


// // console.log(myStream)

//     return (
//         <div className='bg-slate-100 dark:bg-stone-800 p-4 h-full w-full text-gray-900 dark:text-gray-200 flex flex-col-reverse md:grid md:grid-cols-4 gap-4'>
//             {/* Local Video Section */}
//             <div className='relative col-span-4 md:col-span-3 h-[60vh] md:h-full  rounded-lg overflow-hidden'>
            
//                 {remoteStream ? (
//                     <>
//                     User
//                     <VideoWrapper stream={remoteStream} isMuted={false} />
//                     </>
//                 )
//                     : (
//                         <div className='flex items-center justify-center h-full'>
//                             <Loader />
//                         </div>
//                     )
//                 }

//                 {/* Controls */}
//                 <div className='absolute inset-x-0 bottom-4 md:bottom-8 flex justify-around md:justify-center gap-4 px-2 md:px-8'>
//                     <MdCallEnd onClick={handleOnClickCallEnd} className='text-4xl text-white bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer' />
                

//                 </div>
//             </div>

//             {/* Remote Video Section */}
//             <div className='relative col-span-4 md:col-span-1 h-40 md:h-auto  rounded-lg overflow-hidden'>
//                 <div className='h-full md:h-fit absolute bottom-2 rounded-lg overflow-clip w-full'>
                 
//                     My Stream

//                     {myStream || localStreamRef.current? (
//                         <VideoWrapper stream={remoteStream} isMuted={true} />
//                     ) : (
//                         <div className='flex items-center justify-center h-full'>
//                             <Loader />
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default VideoCallInterfaceModal;
