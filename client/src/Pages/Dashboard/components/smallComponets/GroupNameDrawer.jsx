import React, { useState } from 'react';
import Loader from '../../../../common/Loader';
import { IoArrowBackSharp } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useDarkMode } from '../../../../Contexts/DarkModeWrapper';
import { toast } from 'react-toastify';

const GroupNameDrawer = ({ handleCreateGroup, setGroupDrawerValue, setValue, groupMembers, createGroupLoading }) => {

    const [groupChatName, setGroupName] = useState('');
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [file,setFile]=useState(null);

    // GROUP NAME HANDLER 
    const handleInpChange = (e) => {
        const groupName = e.target.value;
        setGroupName(groupName);
    }
    // Handle avatar update
    const handleAvatarUpdate = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const previewUrl = URL.createObjectURL(file);
        setPreviewAvatar(previewUrl);
        setFile(file);
    }

    const handleReqGroupCreation = () => {
        const formData = new FormData();
        if (file?.size > 2000000) {
            toast.error("Kindly upload image less than 2mb")
            setPreviewAvatar('');
            setFile(null);
            return;
        }
        if (file) {
            formData.append("avatar", file);
        }
        formData.append("groupChatName", groupChatName);
        formData.append("users", JSON.stringify(groupMembers));
        handleCreateGroup(formData);
    }

    return (
        <div>
            {/* header */}
            <div className='flex  min-w-full items-center justify-between  h-10 p-4'>
                <IoArrowBackSharp onClick={() => setGroupDrawerValue("AddToGroup")} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"Group Details"}</p>
            </div>

            <div className='mt-5 w-32 h-32 rounded-full mx-auto bg-stone-500 overflow-clip relative'>
                {/* Image Upload */}
                <img src={previewAvatar ? previewAvatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    className='w-32 h-32  mx-auto bg-stone-800 object-cover cursor-pointer rounded-full'>
                </img>
                <label htmlFor='avatar' className='absolute cursor-pointer text-sm text-gray-100 rounded-b-full 
                         bg-black opacity-55 hover:opacity-65  text-center inset- w-full bottom-0 h-10 z-10 right-0'>
                    <input
                        onChange={handleAvatarUpdate} type="file" name="avatar" id='avatar' accept='image/*' hidden />
                    <p className='my-1 font-semibold'> Add Image</p>

                </label>
            </div>

            {/* Group Name */}
            <div className='flex justify-between items-center'>
                <input type="text" name="groupName"
                    className='outline-none border-b mt-4 bg-transparent border-stone-800 p-2 w-full'
                    onChange={handleInpChange}
                    value={groupChatName}
                    placeholder='Enter Group Name'
                    id="" />
            </div>

            <div className='dark:bg-stone-700 mb-5 bg-gray-200 w-full h-[1px]' />

            {/* Create Group Button */}
            <button
                onClick={() => handleReqGroupCreation()}
                disabled={groupMembers?.length < 2 || createGroupLoading}
                className={` w-full flex items-center justify-center rounded-full border-2 border-stone-600 hover:border-blue-500 bg-stone-800 text-white font-semibold text-sm  px-4 py-2 mt-4 ${groupMembers.length < 2 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                {createGroupLoading ? <Loader /> : "Create Group"}
            </button>



        </div >
    );
}

export default GroupNameDrawer;
