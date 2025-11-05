import React, { useState } from 'react';
import { RiAddBoxFill } from "react-icons/ri";
import SearchInp from './smallComponets/SearchInp';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { useChatContext } from '../../../Contexts/ChatProvider';
import { accessedChat, commonDrawer } from '../../../atoms/state';
import { useRecoilState } from 'recoil';

const AllGroups = () => {
    const {allChats} = useChatContext();
    const [filterChats,setFilterChats]=useState(allChats?.filter((i)=>i.isGroupChat===true))
    const [currSelectedChat,setCurrSelectedChat]=useRecoilState(accessedChat)
    // const [value, setValue] = useRecoilState(commonDrawer);
   const handleSearch=(e)=>{
        const searchTerm=e.target.value.toLowerCase();
        if(!searchTerm){
            setFilterChats(allChats?.filter((i)=>i.isGroupChat===true))
        }else{
            setFilterChats(allChats?.filter((i)=>i.isGroupChat===true).filter((i)=>i?.chatName?.toLowerCase().includes(searchTerm)))
        }
    }

    return (
        <div className=' w-full relative'>
            <div className='sticky top-0 z-10 '>

                <div className='flex items-center  justify-between'>

                    <h2 className='text-2xl  font-bold text-gray-900 dark:text-gray-300'>
                        All Groups
                    </h2>

                    <div className='flex items-center gap-5'>

                        {/* <RiAddBoxFill onClick={() => setValue("CreateGroup")}title='New Group' className='text-2xl cursor-pointer hover:text-blue-400 text-blue-600' /> */}
                        <PiDotsThreeOutlineVerticalFill title='Options' className='text-xl cursor-pointer hover:text-gray-400 text-gray-600' />
                    </div>           
                     </div>

                {/* search */}
                <div className='my-4'>
                    <SearchInp placeholder="Search groups" onChange={handleSearch} />
                </div>
            </div>


            {/* groups */}
            <div className='flex overflow-y-scroll relative max-h-[calc(100vh-100px)] flex-col gap-2'
                style={{ scrollbarWidth: 'none', scrollbarColor: 'blue' }}>

                {filterChats?.map((item) =>
                    <div key={item._id} onClick={() => {setCurrSelectedChat(item)}}
                     className='flex items-center hover:bg-stone-100  dark:hover:bg-stone-700 gap-5 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white'
                    >
                        <img src={item?.groupAvatar} alt={item.chatName}
                            className='w-12 h-12  bg-black rounded-full' />
                        <div>
                            <h3 className='text-md font-semibold'>
                                {item.chatName}
                            </h3>
                            <p className='text-xs text-gray-400'>
                               {item?.latestMessage?.content ? item?.latestMessage?.content : "No Message"}
                            </p>
                        </div>
                    </div>)
                }

            </div>


        </div>
    );
}

export default AllGroups;
