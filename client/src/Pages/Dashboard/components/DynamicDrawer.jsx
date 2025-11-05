import React, { useEffect, useState } from 'react';
import AllChats from './AllChats';
import AllGroups from './AllGroups';
import { useRecoilState } from 'recoil';
import { sideBarTab } from '../../../atoms/state';
import AllMoods from './AllMoods';
import AllCalls from './AllCalls';
import { IoIosArrowDroprightCircle } from "react-icons/io";

const DynamicDrawer = ({collapse, setCollapse}) => {
    const [tab, setTab] = useRecoilState(sideBarTab)

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault(); 
                setCollapse(prev => !prev); 
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);


    return (
        <div className={`${collapse ? 'absolute translate-x-[-100%]' : 'translate-x-0'}  shadow-lg dark:bg-stone-800 bg-white  min-h-full max-h-screen p-3 md:p-5 rounded-t-3xl flex  min-w-full md:min-w-[350px]  md:max-w-[400px] transition-all ease-linear duration-75`}>
            <div onClick={() => setCollapse(!collapse)} className='absolute  max-sm:hidden shadow-lg w-3 rounded-md cursor-pointer hover:bg-blue-700 bg-blue-800 top-1/2 h-20 -right-2 flex flex-col items-center justify-center'>
                <IoIosArrowDroprightCircle className={`text-gray-300 text-sm cursor-pointer ${!collapse ? 'rotate-180' : 'rotate-0'}`} />
            </div>
            {
                tab === 'Chats' && <AllChats /> ||
                tab === 'Groups' && <AllGroups /> ||
                tab === 'Moods' && <AllMoods /> ||
                tab === 'Calls' && <AllCalls />
            }
        </div>
    );
}

export default DynamicDrawer;
