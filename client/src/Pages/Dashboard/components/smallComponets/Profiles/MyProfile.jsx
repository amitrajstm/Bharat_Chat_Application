import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { commonDrawer, userData } from '../../../../../atoms/state';
import { IoArrowBackSharp } from 'react-icons/io5';
import { FaEye, FaRegUserCircle } from "react-icons/fa";
import { MdMailOutline } from 'react-icons/md';
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaSquarePen } from "react-icons/fa6";
import Loader from '../../../../../common/Loader';
import { deleteAvatar, updateAvatar, updateProfile } from '../../../../../constants/userProfileApiCalls';
import { toast } from 'react-toastify';
import ModalWrapper from '../../../../../common/ModalWrapper'

const MyProfile = () => {
    const [currentUser, setCurrUser] = useRecoilState(userData);
    const [value, setValue] = useRecoilState(commonDrawer);

    const [avatarLoader, setAvatarLoader] = useState(false);
    const [profileLoader, setProfileLoader] = useState(false);
    const [enbleEdit, setEnableEdit] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState(currentUser);
    useEffect(() => {
        setData(currentUser);
    }, []);

    // handle avatar update
    const handleAvatarUpdate = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("avatar", e.target.files[0]);
        setAvatarLoader(true)
        updateAvatar(formData).then(res => {
            setCurrUser((prev) => ({ ...prev, avatar: res?.user?.avatar }))
            toast.success(res?.data?.message);
        }).finally(() => {
            setAvatarLoader(false);
        })
    }
    const hadleDeleteAvatar = (e) => {
        setAvatarLoader(true)
        deleteAvatar().then(res => {
            setCurrUser((prev) => ({ ...prev, avatar: res?.user?.avatar }))
            toast.success(res?.data?.message);
        }).finally(() => {
            setAvatarLoader(false);
        })
    }

    // HANDLE PROFILE DETAILS UPDATE
    const handleProfileDetailsUpdate = () => {
        setProfileLoader(true)
        updateProfile(data).then(res => {
            setCurrUser((prev) => ({ ...prev, fullName: res.user.fullName, userName: res.user.userName, about: res.user.about }))
            toast.success(res?.data?.message || 'Profile Updated🎉');
            setEnableEdit(false);
        }).finally(() => {
            setProfileLoader(false);
        })
    }

    const handleChage = (e) => {
        const val = e.target.value;
        setData((prev) => ({ ...prev, [e.target.name]: val }))
    }


    return (
        <div>

            {/* header */}
            <div className='flex  min-w-full items-center justify-between  h-10 p-4'>
                <IoArrowBackSharp onClick={() => setValue(null)} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"My Profile"}</p>
            </div>

            {/* Profile DP */}
            <div className='w-full py-5 relative px-2'>
                <FaEye
                    onClick={() => setOpenModal(true)}
                    title='Edit Profile Picture'
                    className='absolute top-2 right-2  text-xl hover:text-gray-200 cursor-pointer' />

                <ModalWrapper open={openModal} setOpenModal={setOpenModal}>
                    <div className='md:w-[350px] lg:w-[500px] w-[90%] bg-white p-5 dark:bg-stone-800 '
                        style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)' }}>
                        <img src={currentUser?.avatar} alt={currentUser?.fullName}
                            className='w-[300px] h-[300px] mx-auto lg:w-[400px] lg:h-[400px] bg-white rounded-lg object-cover' />
                        {currentUser?.avatar !== "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" &&
                            <div className='flex items-center my-5 justify-center gap-5'>
                                <button onClick={hadleDeleteAvatar}
                                    disabled={avatarLoader}
                                    className=' bg-red-500 px-3 py-1 hover:bg-red-400 flex items-center justify-center rounded-full cursor-pointer'>
                                    {avatarLoader ? <Loader /> : "Remove Image"}
                                </button>
                            </div>
                        }
                    </div>
                </ModalWrapper>

                <div className='w-32 h-32 mx-auto bg-stone-500 rounded-full p-1 overflow-clip relative'>
                    {
                        avatarLoader ?
                            <div className=' absolute top-14 left-1  flex items-start justify-center  w-full'>
                                <Loader />
                            </div>
                            : <>
                                <img
                                    title='View Profile Picture'
                                    onClick={() => setOpenModal(true)}
                                    src={currentUser?.avatar} alt={currentUser?.fullName}
                                    className='w-full h-full rounded-full cursor-pointer object-cover' />
                                <label htmlFor='avatar' className='absolute cursor-pointer text-sm text-gray-100 rounded-b-full 
                         bg-black opacity-55 hover:opacity-65  text-center inset- w-full bottom-0 h-10 z-10 right-0'>
                                    <p className='my-1 font-semibold'> Add Photo</p>
                                    <input type="file" name="avatar" accept='image/*' onChange={handleAvatarUpdate} className='hidden'
                                        id='avatar' />
                                </label>
                            </>
                    }
                </div>

            </div>

            {/* Profile Details */}
            <form onSubmit={(e) => e.preventDefault()} className='flex flex-col mt-10 gap-5 h-full w-full'>

                {/* user name */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <MdAlternateEmail />
                    <input type="text" name="userName" id=""
                        value={data?.userName}
                        disabled={!enbleEdit}
                        onChange={handleChage}
                        placeholder='Username'
                        required
                        className='w-full bg-stone-700 rounded pl-2 bg-transparent border-b border-gray-300 py-2 text-sm  font-semibold  outline-none' />
                </div>

                <div className='w-full  text-2xl  items-center px-2 flex gap-5'>
                    <FaRegUserCircle />
                    <input type="text" name="fullName" id=""
                        value={data?.fullName}
                        disabled={!enbleEdit}
                        onChange={handleChage}
                        required
                        placeholder='Full Name'
                        className='w-full bg-stone-700 rounded pl-2 bg-transparent border-b border-gray-300 py-2 text-sm  font-semibold  outline-none' />
                </div>



                {/* Email */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <MdMailOutline />
                    <input type="text"
                        value={currentUser?.email}
                        disabled
                        required
                        placeholder='Email'
                        className='w-full cursor-not-allowed bg-stone-600 rounded pl-2 bg-transparent border-b border-gray-300 py-2 text-sm  font-semibold  outline-none' />
                </div>

                {/* About */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <MdOutlineReportGmailerrorred />
                    <input type="text" name="about" id=""
                        value={data?.about || 'About'}
                        disabled={!enbleEdit}
                        onChange={handleChage}
                        placeholder='About'
                        required
                        className='w-full  bg-stone-700 rounded pl-2 bg-transparent border-b border-gray-300 py-2 text-sm  font-semibold  outline-none' />
                </div>

                <div className='w-full flex gap-4 justify-center'>
                    {!enbleEdit && <button
                        onClick={() => setEnableEdit(true)}
                        className='bg-blue-500 hover:bg-blue-700 my-5 flex items-center gap-3 text-white px-5 py-1 font-semibold rounded-lg'>
                        <FaSquarePen />  Edit Profile
                    </button>}
                    {enbleEdit &&
                        <button
                            onClick={handleProfileDetailsUpdate}
                            disabled={profileLoader}
                            className='bg-blue-500 hover:bg-blue-700 my-5 flex items-center gap-3 text-white px-5 py-1 font-semibold rounded-lg'>
                            {
                                profileLoader ? <Loader /> : "Save"
                            }
                        </button>
                    }
                    {enbleEdit && <button onClick={
                        () => {
                            setEnableEdit(false);
                        }
                    } className='bg-red-500 hover:bg-red-700 my-5 flex items-center gap-3 text-white px-5 py-1 font-semibold rounded-lg'>
                        Cancel
                    </button>
                    }
                </div>

            </form>
        </div>
    );
}

export default MyProfile;
