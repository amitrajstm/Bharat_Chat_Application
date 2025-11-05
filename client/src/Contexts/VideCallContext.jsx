import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "./SocketProvider";
import { useRecoilState } from "recoil";
import { userData } from "../atoms/state";
import { getRandomId } from "../../utils/helpers";
import usePeer from "../hooks/usePeer";
import { toast } from "react-toastify";

export const VideoCallContext = createContext();

export const VideoCallProvider = ({ children }) => {
    // GENERAL STATES
    const [incomingCall, setIncomingCall] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [receiverStatus, setReceiverStatus] = useState('');
    const [initCall, setInitCall] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [camOn, setCamOn] = useState(true);
    const [partnerMicStatus, setPartnerMicStatus] = useState(false);
    const [remotePeerId, setRemotePeerId] = useState(null);
    const [partnerCamStatus, setPartnerCamStatus] = useState(false);
    // const [isScreenSharing, setIsScreenSharing] = useState(null);

    // SOCKET CONTEXT API
    const socket = useSocket();

    // RECOIL STATES
    const [currUser] = useRecoilState(userData);

    // STREAMS STATES
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    // REFERENCE STATES
    const remoteVideoRef = useRef();
    const localStreamRef = useRef();
    // const screenShareTrackRef = useRef();

    // PEER HOOK STATES
    const { peer, myPeerId } = usePeer();

    // INIT CALL
    const startVideoCall = useCallback(async ({ chatId, targetId }) => {
        if (!socket) return;
     
        const roomId = getRandomId();
        setRoomId(roomId);

        if (!peer) {
            console.log('PEER NOT INITIALIZED')
            return;
        }
        // Emit details to the server
        socket.emit("startCall", {
            targetId,
            roomId,
            peerId: myPeerId,
            targetChatId: chatId,
            user: currUser,
            myMicStatus: isMuted,
            myCamStatus: camOn,
        });

        setReceiverStatus('Calling...');

    }, [camOn, currUser, isMuted, myPeerId, peer, socket]);

    // ACCEPT CALL
    const handleOnAccept = useCallback(async () => {
        if (!incomingCall) return;
        const myCurrStream = navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (!myCurrStream) {
            toast.error('Kindly turn on camera and mic before accepting call');
            return;
        }
        setMyStream(myCurrStream);
        if (!peer) {
            toast.error('Something went wrong in accepting call')
            return;
        }

        socket.emit("acceptCall", {
            roomId: incomingCall.roomId,
            user: currUser,
            accepterPeerId: myPeerId,
            callerPeerId: incomingCall.peerId,
        });

        setCallAccepted(true);
        setReceiverStatus('');
        setIncomingCall(null);
        setInitCall(false);

    }, [currUser, incomingCall, myPeerId, peer, socket]);

    // REJECT CALL SOCKET EVENT HANDLER
    const handleRejectCall = useCallback(() => {
        if (incomingCall) {
            socket.emit("declineCall", {
                roomId: incomingCall.roomId,
                user: currUser,
                targetId: incomingCall.targetId,
            });
            setIncomingCall(null);
            setReceiverStatus('Call Declined User is busy!');
        }
    }, [currUser, incomingCall, socket]);


    // ESTABLISH PEER CALL AND CONNECTION
    const handleConnectedCall = useCallback(async ({ callerPeerId, accepterPeerId }) => {

        if (!peer) {
            toast.error('Something went wrong in connecting call')
            return;
        }
    
        try {
            setLoading(true);
            setRemotePeerId(accepterPeerId);
            const call = peer.call(accepterPeerId, myStream);
            call.on('stream', (remoteStream) => {
                toast.success('Call connected')
                // remoteVideoRef.current = remoteStream;
                setRemoteStream(remoteStream);
                setLoading(false);

            })
            call.on('error', (err) => {
                console.log(err);
            })
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

        setCallAccepted(true);
        setInitCall(false);

    }, [myStream, peer])



    // HANDLE CALL END SOCKET EVENT
    const handleCallEnd = useCallback(() => {
        window.location.reload();
        // if (localStreamRef.current) {
        //     localStreamRef.current.getTracks().forEach(track => track.stop());
        //     myStream(null);
        // }
        // if (peer) {
        //     peer.destroy();
        // }
        // setCallAccepted(false);
        // setIncomingCall(null);
        // setRoomId(null);
        // setReceiverStatus('')

    }, []);


    // HANDLE CALL END BUTTON
    const handleOnClickCallEnd = useCallback(() => {
        socket.emit("endCall", {
            roomId: roomId,
        })
        handleCallEnd();
    }, [handleCallEnd, roomId, socket])

    //  LISTEN FOR REMOTE CALL AND STREAM
    useEffect(() => {
        if (!peer) {
            return;
        };

        peer.on('call', (call) => {
            call.answer( myStream);
            call.on('stream', (remStream) => {
                setRemoteStream(remStream)
                remoteVideoRef.current = remStream;
            });
        });

    }, [peer, myStream]);


    // SOCKET LISTENERS FOR INCOMING CALLS
    useEffect(() => {
        if (!socket) return;

        socket.on("incomingCall", async ({ caller, roomId, targetChatId, peerId, targetId
            , callerMicStatus, callerCamStatus }) => {

            setIncomingCall({
                caller, roomId,
                targetChatId,
                targetId,
                peerId
            });
            setRoomId(roomId);
            setPartnerMicStatus(callerMicStatus);
            setPartnerCamStatus(callerCamStatus);
        });

        socket.on("callActive", handleConnectedCall);

        socket.on("callTerminated", handleCallEnd);

        socket.on("toggleAudio", ({ micStatus }) => {
            setPartnerMicStatus(micStatus);
        })
        socket.on("toggleVideo", ({ camStaus }) => {
            setPartnerCamStatus(camStaus);
        })

        return () => {
            socket.off("incomingCall");
            socket.off("callActive", handleConnectedCall);
            socket.off("callTerminated", handleCallEnd);
        };

    }, [handleCallEnd, handleConnectedCall, socket]);



    return (
        <VideoCallContext.Provider
            value={{
                handleOnAccept,
                handleRejectCall,
                handleOnClickCallEnd,
                startVideoCall,
                callAccepted,
                incomingCall,
                receiverStatus,
                myStream,
                setMyStream,
                remoteVideoRef,
                initCall, setInitCall,
                localStreamRef,
                remoteStream, setRemoteStream,
                loading, roomId,
                isMuted, camOn,
                setCamOn,
                setIsMuted,
                partnerMicStatus, partnerCamStatus,
            }}
        >
            {children}
        </VideoCallContext.Provider>
    );
};
