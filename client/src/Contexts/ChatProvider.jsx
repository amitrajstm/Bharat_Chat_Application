import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllChats, fetchAllChatsMessages, fetchAllUsers } from "../constants/apiCalls";
import { getCookie } from "../constants/cookiesApis";
import { useRecoilState } from "recoil";
import { accessedChat, userData } from "../atoms/state";
import { fetchAllNotifications } from "../constants/chatNotificationsApis";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    // const [allNotifications, setAllNotifications] = useState([]);
    const [latestMessage, setLatestMessage] = useState({});
    const [messages, setMessages] = useState([]);
    const [allChatsMessages, setAllChatsMessages] = useState([]);
    const token = getCookie('authToken');
    const [currUser] = useRecoilState(userData);
    const [currSelectedChat] = useRecoilState(accessedChat);
    const [chatsloading, setchatLoading] = useState(false);
    const [messagesloading, setchatmessagesLoading] = useState(false);
    const [usersChatLoading, setUsersChatsLoading] = useState(false);


    const handleFetchChats = () => {
        setchatLoading(true);
        fetchAllChats().then((allChats) => {
            setAllChats(allChats);
            setchatLoading(false);
        }).catch((error) => {
            console.log(error);
            setchatLoading(false);

        });

    }
    useEffect(() => {

        if (token) {
            handleFetchChats();
            setUsersChatsLoading(true);

            fetchAllUsers().then((allUsers) => {
                setUsersChatsLoading(false)
                setAllUsers(allUsers?.users);
            }).catch((error) => {
                console.log(error);
                setUsersChatsLoading(false)

            });


            fetchAllChatsMessages().then((res) => {
                setAllChatsMessages(res.allChatsMessages);
            }).catch((error) => {
                // console.log(error);
            });

        }

    }, [currUser, token]);


// console.log(messages)
    return (
        <ChatContext.Provider value={{
            allUsers, allChats,
            latestMessage, setLatestMessage, messages, setMessages,
            notifications, setNotifications, setAllUsers, setAllChats,
            handleFetchChats, allChatsMessages, setAllChatsMessages,
            chatsloading, setchatLoading,
            usersChatLoading, setUsersChatsLoading
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatContext = () => useContext(ChatContext);
