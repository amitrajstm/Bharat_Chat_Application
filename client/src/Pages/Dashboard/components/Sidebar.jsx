import React, { useState } from 'react';
import { IoMdChatbubbles } from "react-icons/io";
import { IoCallSharp } from "react-icons/io5";
import { TiGroup } from "react-icons/ti";
import { MdDarkMode, MdLightMode, MdOutlinePowerSettingsNew } from "react-icons/md";
import { SiApostrophe } from "react-icons/si";
import { IoSettings } from "react-icons/io5";
import { useDarkMode } from '../../../Contexts/DarkModeWrapper';
import { useRecoilState } from 'recoil';
import { commonDrawer, sideBarTab, userData } from '../../../atoms/state';
import { logoutUser } from '../../../constants/apiCalls';
import ModalWrapper from '../../../common/ModalWrapper';
import Confirmation from '../../Auth/components/confirmation';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../../../Contexts/ChatProvider';

const SidebarItems = [
    {
        id: 1,
        title: "Chats",
        icon: <IoMdChatbubbles title='Chats' />

    },
    {
        id: 2,
        title: "Groups",
        icon: <TiGroup title='Groups' />
    },
    // {
    //     id: 3,
    //     title: "Moods",
    //     icon: <SiApostrophe title='Moods' />
    // },

    // {
    //     id: 4,
    //     title: "Calls",
    //     icon: <IoCallSharp title='Calls' />
    // },

]



const Sidebar = () => {
    const { mode, toggleMode } = useDarkMode();
    const [tab, setTab] = useRecoilState(sideBarTab);
    const [currUser, setCurrUser] = useRecoilState(userData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const [value, setValue] = useRecoilState(commonDrawer)

    const { notifications, setNotifications } = useChatContext();

    const hadleLogOut = () =>
        logoutUser().then((res) => {
            if (res) {
                setCurrUser(null)
                navigate('/login')
            }
        });


    return (
        <div className='bg-white dark:bg-stone-900 h-screen p-1 md:p-2 md:min-w-14 max-sm:w-10 shadow-lg overflow-clip'>

            <div className='flex flex-col py-5 pb-10 justify-between  h-full text-xl text-blue-500'>
                <img onClick={() => setValue("Profile")} title='My Profile' src={currUser?.avatar}
                    className='w-8 h-8 md:w-10 md:h-10 p-[2px] bg-white cursor-pointer rounded-full'
                    style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)' }}
                    alt={currUser?.fullName} />

                <div className='flex my-5 items-center flex-grow flex-col gap-2'>
                    {
                        SidebarItems?.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setTab(item.title)}
                                className={`w-full relative h-8 md:h-10 cursor-pointer flex items-center justify-center rounded-lg transition-shadow duration-300 ${item.title === tab
                                    ? 'bg-white dark:bg-stone-800 shadow-lg border-2 border-stone-300 dark:border-stone-600 text-blue-600 dark:text-blue-400'
                                    : 'hover:shadow-lg hover:text-blue-600 hover:bg-white dark:hover:bg-stone-800  dark:text-blue-400 '
                                    }`}
                                style={
                                    item.title === tab || item === tab
                                        ? { boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.2)' }
                                        : {}
                                }
                            >
                                {notifications?.length > 0 && item.title === 'Chats' && (
                                    <div className='bg-gradient-to-r text-[10px] from-red-400 to-red-600 absolute z-10 top-1 left-1  text-white font-semibold flex items-center justify-center rounded-full 
                                    w-6  h-4 shadow-lg border border-white'>
                                        {
                                            notifications?.length > 50 ? '50+' : notifications?.length
                                        }
                                    </div>
                                )}

                                {item.icon}
                            </div>
                        ))


                    }

                </div>

                <div className='flex flex-col items-center text-gray-700 dark:text-gray-200 gap-5'>
                    {!mode ? <MdDarkMode className="text-2xl text-blue-800  dark:text-indigo-100 cursor-pointer " onClick={toggleMode} />
                        : <MdLightMode className="text-2xl text-blue-800 dark:text-indigo-100 cursor-pointer" onClick={toggleMode} />
                    }
                    {/* <IoSettings title='Settings' /> */}
                    <ModalWrapper open={isModalOpen} setOpenModal={setIsModalOpen}>
                        <Confirmation handler={hadleLogOut} setOpenModal={setIsModalOpen} />
                    </ModalWrapper>
                    <MdOutlinePowerSettingsNew
                        onClick={() => setIsModalOpen(true)}
                        title='Logout'
                        className='text-red-600 dark:text-red-500 bg-transparent dark:hover:text-red-600 rounded-full hover:text-red-800 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-[0_0_10px_3px_rgba(255,0,0,0.6)]'
                    />

                </div>
            </div>

        </div>
    );
}

export default Sidebar;
