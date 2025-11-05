import { io } from 'socket.io-client';
import { useRecoilState } from 'recoil';
import { accessedChat, allChatsMessagesState, commonDrawer, userData } from '../../atoms/state';
import ChatArea from './Chat/ChatArea';
import Sidebar from './components/Sidebar';
import DynamicDrawer from './components/DynamicDrawer';
import CommonDrawer from './components/smallComponets/CommonDrawer';
import { useContext, useEffect, useState } from 'react';
import { fetchAllChatsMessages } from '../../constants/apiCalls';
import { VideoCallContext } from '../../Contexts/VideCallContext';
import IncomingCallBox from '../../VideoChat/components/IncomingCallBox';
import ModalWrapper from '../../common/ModalWrapper';
import VideoCallInterfaceModal from '../../VideoChat/VideoCallInterfaceModal';
import ReceiverStatusBox from '../../VideoChat/components/ReceiverStatusBox';
import OutGoingCallScreen from '../../VideoChat/components/OutGoingCallScreen';
import { getSenderDetails } from './Chat/constants';

const Dashboard = () => {
    const [currUser] = useRecoilState(userData);
    const [currSelectedChat] = useRecoilState(accessedChat);
    const [value, setValue] = useRecoilState(commonDrawer)
    const [collapse, setCollapse] = useState(false)
    const [showDrawer, setShowDrawer] = useState(true)

    const [allChatsWithMessages, setAllChatMessages] = useRecoilState(allChatsMessagesState);
    const [loading, setLoading] = useState(false);

    const { incomingCall, handleOnAccept, handleRejectCall
        , callAccepted, setCallAccepted, receiverStatus, setReceiverStatus, initCall, setInitCall } = useContext(VideoCallContext);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(currSelectedChat)
        setShowDrawer(false);
    },[currSelectedChat]);

    useEffect(() => {
        if(value)
        setShowDrawer(true);
    else {
        if(currSelectedChat)
        setShowDrawer(false)};
    },[value,currSelectedChat]);

    useEffect(() => {
        if (!loading && currUser) {
            setLoading(true);
            fetchAllChatsMessages().
                then((res) => {
                    setAllChatMessages(res?.allChatMessages)
                }).finally(() => {
                    setLoading(false);
                })
        }
    }, [currUser])

    useEffect(() => {
        if (incomingCall) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [incomingCall])


    return (
        <div className='relative flex h-screen overflow-clip w-full bg-gray-100 dark:bg-stone-700'>
            <div className='sticky z-50 '>
                <Sidebar />
            </div>
            <div className={`sticky z-10  bg-white dark:bg-stone-700 max-sm:w-screen md:max-w-[400px] rounded-t-xl md:rounded-t-2xl  p-1 max-sm:text-sm mb-0 ${!showDrawer ? 'max-sm:hidden' : ''}`}>
                <CommonDrawer />
                <DynamicDrawer collapse={collapse} setCollapse={setCollapse} />
            </div>

            {/* Main content area */}
            <div className={`dark:bg-stone-800 bg-white flex flex-1 md:w-full rounded-t-xl md:rounded-t-2xl max-sm:text-sm mt-1 mr-1 overflow-clip ${showDrawer ? 'max-sm:hidden' : ''}`}
                style={{ scrollbarWidth: 'thin' }}>
                <ChatArea setShowDrawer={setShowDrawer} setInitCall={setInitCall} />
            </div>

            <ModalWrapper open={open} setOpenModal={setOpen}>
                <IncomingCallBox
                    caller={incomingCall?.caller}
                    onAccept={handleOnAccept}
                    incomingCall={incomingCall}
                    onReject={handleRejectCall}
                />
            </ModalWrapper>


            <ModalWrapper open={receiverStatus} setOpenModal={setReceiverStatus}>
                <ReceiverStatusBox receiverStatus={receiverStatus} />
            </ModalWrapper>


            <ModalWrapper open={callAccepted} outsideClickClose={false} setOpenModal={setCallAccepted}>
                <VideoCallInterfaceModal />
            </ModalWrapper>

            <ModalWrapper open={initCall} outsideClickClose={false} setOpenModal={setInitCall}>
                <OutGoingCallScreen
                    chatId={currSelectedChat?._id}
                    targetUser={getSenderDetails(currUser, currSelectedChat?.users)}
                    setIsOpen={setInitCall}
                />
            </ModalWrapper>

        </div>
    );
};

export default Dashboard;
