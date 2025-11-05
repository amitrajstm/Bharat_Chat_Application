import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userData } from '../atoms/state';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [currUser] = useRecoilState(userData);
    
    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        // const newSocket = io('https://gappe.onrender.com');
        setSocket(newSocket);
 
      if(!newSocket) return;
        if (currUser) {
            newSocket.emit('setup', currUser);
        }
        newSocket.on('connect', () => {
            // console.log('Socket connected:', newSocket.id);
        });

        return () => newSocket.disconnect();
    }, [currUser]);


    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>;

};
export const useSocket = () => useContext(SocketContext);

