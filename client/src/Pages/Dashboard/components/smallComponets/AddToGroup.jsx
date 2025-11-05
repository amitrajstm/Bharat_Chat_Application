import React from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import SearchInp from './SearchInp';
import { IoMdClose } from 'react-icons/io';
import Loader from '../../../../common/Loader';
import UsersListShimmer from './Shimmers/UsersListShimmer';

const AddToGroup = ({
    setValue, allContacts,
    loading, handleAddToGroup,
    usersChatLoading,
    onSearch, isSelected, allUsers,
    handleRemoveFromGroup, setGroupDrawerValue,
    groupMembers, createGroupLoading }) => {


    return (

        <div>
            {/* Header */}
            <div className='flex min-w-full items-center justify-between h-10 p-4'>
                <IoArrowBackSharp onClick={() => setValue("New Chat")} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"Add to Group"}</p>
            </div>

            {/* Search */}
            <div className='my-4'>
                <SearchInp onChange={onSearch} placeholder="Search users" />
            </div>

            {/* Selected Users */}
            <div className='flex font-semibold  flex-wrap text-xs'>
                {allUsers.map((user) => (
                    isSelected(user._id) && (
                        <div key={user._id} className='flex m-1 text-white bg-blue-500 rounded-full px-2 items-center gap-2 justify-between'>
                            {user.email.slice(0, 12) + ".."}
                            <IoMdClose onClick={() => handleRemoveFromGroup(user._id)} />
                        </div>
                    )
                ))}
            </div>

            <div className='dark:bg-stone-700 bg-gray-200 w-full h-[1px]' />

            {/* Create Group Button */}
            <button
                onClick={() => setGroupDrawerValue("GroupName")}
                disabled={groupMembers?.length < 2 || createGroupLoading}
                className={`w-full flex items-center justify-center rounded-full border-2 border-stone-600 hover:border-blue-500 bg-stone-800 text-white font-semibold text-sm px-4 py-2 mt-4 ${groupMembers.length < 2 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                {createGroupLoading ? <Loader /> : "Continue"}
            </button>


            {/* All Users */}
            {usersChatLoading ? (
                <div className='flex overflow-y-auto relative max-h-[calc(100vh-100px)] flex-col gap-1 mt-2'>
                    {Array(5).fill().map((_, index) => <UsersListShimmer key={index} />)}
                </div>
            ) : (
                <div className='flex overflow-y-auto relative max-h-[calc(100vh-100px)] flex-col gap-1 mt-2'>
                    {allContacts?.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleAddToGroup(item._id)}
                            className={`relative flex items-center hover:bg-stone-100 dark:hover:bg-stone-700 gap-5 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white`}
                        >
                            <img src={item.avatar} alt={item.fullName} className='w-12 h-12 bg-black rounded-full' />
                            <div>
                                <h3 className='text-md font-semibold'>{item.fullName}</h3>
                                <p className='text-xs text-gray-400'>{item.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddToGroup;
