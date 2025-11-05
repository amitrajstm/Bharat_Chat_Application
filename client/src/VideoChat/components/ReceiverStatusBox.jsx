import React, { useContext } from 'react';
import { VideoCallProvider } from '../../Contexts/VideCallContext';

const ReceiverStatusBox = ({receiverStatus}) => {
  
    if (!receiverStatus)
        return;

    return (
        <div className='bg-white dark:bg-stone-800 p-4 flex-grow max-w-3xl'>
            {receiverStatus && <p className='text-lg font-semibold'>{receiverStatus}</p>
            }
        </div>
    );
}

export default ReceiverStatusBox;
