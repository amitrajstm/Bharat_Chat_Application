import React, { useEffect, useState } from 'react';
import SearchInp from './SearchInp';
import { MdGroup } from 'react-icons/md';
import { useChatContext } from '../../../../Contexts/ChatProvider';
import { accessChat, fetchAllUsers } from '../../../../constants/apiCalls';
import Loader from '../../../../common/Loader';
import UsersListShimmer from './Shimmers/UsersListShimmer';
import { useRecoilState } from 'recoil';
import { accessedChat, commonDrawer } from '../../../../atoms/state';
import { IoArrowBackSharp } from 'react-icons/io5';


const NewChatDrawer = () => {
    const { allUsers, setAllUsers, handleFetchChats, usersChatLoading } = useChatContext();
    const [loading, setLoading] = useState(false);
    const [accessChatLoading, setAcessChatLoading] = useState(false);
    const [currSelectedChat, setCurrSelectedChat] = useRecoilState(accessedChat);
    const [value, setValue] = useRecoilState(commonDrawer)


    //SEARCHING API ONCHANGE
    const onSearch = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        setLoading(true);
        fetchAllUsers(e.target.value).then((allUsers) => {
            setAllUsers(allUsers?.users);
        }).finally(() => {
            setLoading(false);
        })
    }

    //ACCESS CHAT OR CREATE CHAT
    const handleAccessChat = (userId) => {
        setAcessChatLoading(true);
        accessChat(userId).then((res) => {
            setCurrSelectedChat(res.chat[0]);
            handleFetchChats()
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setAcessChatLoading(false);
        })
    }

    useEffect(() => {
        fetchAllUsers().then((allUsers) => {
            setAllUsers(allUsers?.users);
        })
    }, []);

    return (
        <div>
            {/* header */}
            <div className='flex  min-w-full items-center justify-between  h-10 p-4 '>
                <IoArrowBackSharp onClick={() => setValue(null)} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"New Chat"}</p>
            </div>

            {/* search */}
            <div className='my-4'>
                <SearchInp onChange={onSearch} placeholder="Search users" />
            </div>
            <div onClick={() => setValue("CreateGroup")} className='mt-4  mb-1 flex cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700 py-2 items-center gap-4'>
                <div className='bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center'>
                    <MdGroup size={24} className='' />
                </div>
                <p className='text-sm font-medium'>New Group Chat</p>
            </div>

            <div className='dark:bg-stone-700 bg-gray-200 w-full h-[1px]' />
            {/* All Users */}

            <div className='  overflow-y-auto' style={{scrollbarWidth: 'none'}}>
                {
                    usersChatLoading ?
                        (<div className='flex overflow-y-auto  relative max-h-[calc(100vh-100px)] flex-col gap-1 mt-2'
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'blue' }}>
                            {Array(5).fill().map((_, index) => <UsersListShimmer key={index} />)}
                        </div>)
                        : (<div className='flex overflow-y-auto relative max-h-[calc(100vh-230px)] flex-col gap-1 mt-2'
                            style={{ scrollbarWidth: 'thin' }}>
                            {allUsers?.map((item) =>
                                <div key={item._id} onClick={() => handleAccessChat(item._id)} className='relative flex items-center hover:bg-stone-100 dark:hover:bg-stone-700  gap-5 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white'
                                >
                                    <img src={item.avatar} alt={item.fullName}
                                        className='w-12 h-12  bg-black rounded-full ' />
                                    <div>
                                        <h3 className='text-md  font-semibold'>
                                            {item.fullName}
                                        </h3>
                                        <p className='text-xs text-gray-400'>
                                            {item.email}
                                        </p>
                                    </div>
                                </div>)
                            }
                        </div>)
                }
            </div>
        </div >
    );
}

export default NewChatDrawer;
