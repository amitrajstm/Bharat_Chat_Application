import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoWrapper = ({ stream, isMuted ,pipe}) => {

  return (
    <ReactPlayer
      url={stream}
      playing={true}
      muted={isMuted}
      controls={false}
      pipe={pipe}
      width="100%"
      aspectRatio="9:16"
      height="100%"
     
      />
  );
};

export default VideoWrapper;
