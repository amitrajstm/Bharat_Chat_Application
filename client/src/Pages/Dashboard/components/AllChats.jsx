import React, { useEffect, useState } from 'react';
import { RiAddBoxFill } from "react-icons/ri";
import SearchInp from './smallComponets/SearchInp';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { useRecoilState } from 'recoil';
import { accessedChat, allChatsMessagesState, commonDrawer, userData } from '../../../atoms/state';
import { useChatContext } from '../../../Contexts/ChatProvider';
import { fetchAllChats } from '../../../constants/apiCalls';
import UsersListShimmer from './smallComponets/Shimmers/UsersListShimmer';
import { getSenderDetails } from '../Chat/constants';
import ContextMenuWrapper from '../../../common/ContextMenuWrapper';
import DropdownWrapper from '../../../common/DropDownWrapper';

const AllChats = () => {
    const [commonDrawerTab, setCommonDrawerTab] = useRecoilState(commonDrawer);
    const [currSelectedChat, setCurrSelectedChat] = useRecoilState(accessedChat);

    const [allChatMessages, setAllChatMessages] = useRecoilState(allChatsMessagesState); //onhold

    const [currentUser] = useRecoilState(userData)
    const { allChats, setAllChats, notifications, latestMessage, 
        messages,allChatsMessages ,chatsloading, setchatLoading} = useChatContext();
    const [filterChats, setFilterChats] = useState(allChats);

   
    const sortChatsByTimestamp = (chats) => {
        return [...chats].sort((a, b) => {
            const timeA = a.lastMessage
                ? new Date(a.lastMessage.timestamp)
                : new Date(0); // Fallback if no message
            const timeB = b.lastMessage
                ? new Date(b.lastMessage.timestamp)
                : new Date(0);

            return timeB - timeA; // Descending order: latest at top
        });
    };

    useEffect(() => {
        if (allChats && allChats.length > 0) {
            const sortedChats = sortChatsByTimestamp(allChats);
            setFilterChats(sortedChats);
        }
    }, [allChats]);

    // Keep chats sorted when notifications arrive
    useEffect(() => {
        if (notifications && notifications.length > 0) {
            const updatedChats = sortChatsByTimestamp(allChats);
            setFilterChats(updatedChats);
        }
    }, [notifications, allChats]);


    const onSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (!searchTerm) {
            setFilterChats(allChats);
        } else {
            setFilterChats(allChats.filter((chat) =>
                chat?.users.fullName?.toLowerCase().includes(searchTerm) ||
                chat?.chatName?.toLowerCase().includes(searchTerm) ||
                chat?.email?.toLowerCase().includes(searchTerm)
            ));
        }

    }
    // console.log(notifications)

    const menuItems = [
        { label: 'Delete', onClick: () => console.log('Delete clicked') },
        { label: 'View', onClick: () => console.log('View Details clicked') },
    ];


 

    return (
        <div className=' w-full  relative '>
            <div className='sticky top-0 z-10 '>

                <div className='flex items-center  justify-between'>

                    <h2 className='text-2xl  font-bold text-gray-900 dark:text-gray-300'>
                        Chats
                    </h2>
                    <div className='flex items-center gap-5'>

                        <RiAddBoxFill onClick={() => setCommonDrawerTab('New Chat')} title='New Chat' className='text-2xl cursor-pointer hover:text-blue-400 text-blue-600' />
                        <PiDotsThreeOutlineVerticalFill title='Options' className='text-xl cursor-pointer hover:text-gray-400 text-gray-600' />
                    </div>

                </div>

                {/* search */}
                <div className='my-4'>
                    <SearchInp onChange={onSearch} placeholder="Search Chats" />
                </div>

                {/* <div className='my-4 px-4 flex gap-2 items-center'>
                    <button className='bg-stone-600 text-gray-50 py-1 px-2 
               rounded-md text-xs  hover:bg-stone-700'>
                        All</button>
                    <button className='bg-stone-600 text-gray-50 py-1 px-2 
               rounded-md text-xs  hover:bg-stone-700'>
                        Groups</button>
                    <button className='bg-stone-600 text-gray-50 py-1 px-2 
               rounded-md text-xs  hover:bg-stone-700 '>
                        Unread</button>
                </div> */}

            </div>

            {/* Chats and groups */}
            
          <div>
            {
                chatsloading ?
                    (<div className='flex overflow-y-auto  relative max-h-[calc(100vh-200px)]  flex-col gap-1 mt-2'
                        style={{ scrollbarWidth: 'none', scrollbarColor: 'blue' }}>
                        {Array(5).fill().map((_, index) => <UsersListShimmer key={index} />)}
                    </div>) :
                    allChats.length === 0 && !chatsloading  ? (
                        <div className='flex justify-center items-center h-[calc(100vh-200px)]'>
                            <p className='  text-gray-500 dark:text-gray-300'>No Chats</p>
                        </div>
                    ):
                    (<div className='flex overflow-y-auto   min-h-full max-h-[calc(100vh-140px)]  flex-col gap-2'
                        style={{ scrollbarWidth: 'none', scrollbarColor: 'blue' }}>
                        {filterChats?.map((item) => {
                           const allNotificationMessages = notifications?.filter((i) => i.chat._id === item?._id);

                          
                           const latestChatMessage = allNotificationMessages && allNotificationMessages.length > 0
                             ? allNotificationMessages[allNotificationMessages.length - 1].content 
                             : (
                                
                                 allChatsMessages?.find((i) => i.chat._id === item?._id)?.messages?.length > 0
                                   ? allChatsMessages.find((i) => i.chat._id === item?._id).messages[allChatsMessages.find((i) => i.chat._id === item?._id).messages.length - 1].content
                                   : item?.latestMessage?.content || 'No message yet'
                               );
                           
                            return (
                                <div
                                    key={item?._id}
                                    onClick={() => setCurrSelectedChat(item)}
                                    className='relative  flex items-center hover:bg-stone-100 dark:hover:bg-stone-700 gap-5 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white'
                                >

                                    <img
                                        src={item?.isGroupChat ? item?.groupAvatar : getSenderDetails(currentUser, item.users)?.avatar
                                            || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                                        }
                                        alt="Avatar"
                                        className='w-12 h-12 bg-white dark:bg-stone-300 rounded-full'
                                    />


                                    <div className='flex-grow '>
                                        <h3 className='text-md font-semibold '>
                                            {item?.isGroupChat ? item?.chatName : getSenderDetails(currentUser, item?.users)?.fullName}
                                        </h3>
                                        <div className={`text-xs flex w-full justify-between items-center ${allNotificationMessages.length > 0 ? 'text-blue-500 font-semibold' : 'text-gray-400'}`}>
                                            {latestChatMessage?.slice(0, 15)}
                                            <p>{allNotificationMessages.length > 0 ? `(${allNotificationMessages.length})` : ''}</p>
                                        </div>

                                    </div>
                                        <DropdownWrapper
                                            buttonLabel=""
                                            menuItems={menuItems}
                                            position="bottom-right"
                                        />

                                </div>
                            );

                        }
                        )}
                   
                    </div>
                )
                    
            }
  </div>



        </div>
    );
}

export default AllChats;
