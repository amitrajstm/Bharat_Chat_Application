import React from 'react';
import { FaBackspace } from 'react-icons/fa';
import { IoBackspace } from 'react-icons/io5';
import { IoArrowBackSharp } from "react-icons/io5";
import { useRecoilState } from 'recoil';
import { commonDrawer, sideBarTab } from '../../../../atoms/state';
import NewChatDrawer from './NewChatDrawer';
import CreateGroupDrawer from './CreateGroupDrawer';
import GroupNameDrawer from './GroupNameDrawer';
import MyProfile from './Profiles/MyProfile';

const CommonDrawer = () => {
    const [value, setValue] = useRecoilState(commonDrawer)
    const [tab, setTab] = useRecoilState(sideBarTab)

    if (!value ) return null;
    return (
        <div className={`${!value ? 'absolute z-30 translate-x-[-100%]' : 'translate-x-0'}  shadow-lg dark:bg-stone-800 min-h-full max-h-screen  p-2 md:p-5  min-w-full md:max-w-[400px] md:min-w-[320px]  transition-all ease-in-out delay-100 duration-100`}>
        
                {
                    value === "New Chat" && <NewChatDrawer /> ||
                    value === "CreateGroup" && <CreateGroupDrawer /> ||
                    value === "Profile" && <MyProfile />
                }

        </div>
    );
}

export default CommonDrawer;
