import { useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { FaEye, FaRegUserCircle } from "react-icons/fa";
import { MdMailOutline } from 'react-icons/md';
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import ModalWrapper from '../../../../../common/ModalWrapper'

const OneonOneChat = ({ data, setOpenModal }) => {
    const [openProfileImageModal, setProfileImageModal] = useState(false)
    if (!data) return null;
    
    return (
        <div className='h-full w-full md:max-w-2xl bg-white dark:bg-stone-800'>

            {/* header */}
            <div className='flex my-5 min-w-full items-center justify-between  h-10 p-4'>
                <IoArrowBackSharp onClick={() => setOpenModal(false)} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"Profile"}</p>
            </div>

            {/* Profile DP */}
            <div className='w-full py-5 relative px-5'>
                <FaEye
                    onClick={() => setProfileImageModal(true)}
                    title='View Profile Picture'
                    className='absolute top-2 right-10  text-xl hover:text-gray-200 cursor-pointer' />

                <ModalWrapper open={openProfileImageModal} setOpenModal={setProfileImageModal}>
                    <div className='md:w-[350px] lg:w-[500px] w-[90%] bg-white p-5 dark:bg-stone-800 '
                        style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)' }}>
                        <img src={data?.avatar} alt={data?.fullName}
                            className='w-[300px] h-[300px] mx-auto lg:w-[400px] lg:h-[400px] bg-white rounded-lg object-cover' />

                    </div>
                </ModalWrapper>

                <div className='w-32 h-32 mx-auto bg-stone-500 rounded-full p-1 overflow-clip relative'>

                    <img
                        title='View Profile Picture'
                        onClick={() => setProfileImageModal(true)}
                        src={data?.avatar} alt={data?.fullName}
                        className='w-full h-full rounded-full cursor-pointer object-cover' />



                </div>

            </div>

            {/* Profile Details */}
            <div className='flex flex-col mt-10 gap-5 h-full w-full md:max-w-[70%] mx-auto'>

                {/* user name */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <MdAlternateEmail />
                    <div>
                        <div className='text-sm px-2'>
                            Username
                        </div>
                        <div
                            className='w-full bg-stone-700 rounded pl-2 bg-transparent   py-2 text-sm  font-semibold  outline-none' >

                            {data?.userName}
                        </div>
                    </div>
                </div>

                <div className='w-full  text-2xl  items-center px-2 flex gap-5'>
                    <FaRegUserCircle />
                    <div>
                        <div className='text-sm px-2'>
                            Full Name
                        </div>
                        <div
                            className='w-full bg-stone-700 rounded pl-2 bg-transparent   py-2 text-sm  font-semibold  outline-none' >

                            {data?.fullName}
                        </div>
                    </div>
                </div>



                {/* Email */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <MdMailOutline />
                    <div>
                        <div className='text-sm px-2'>
                            Email
                        </div>
                        <div
                            className='w-full bg-stone-700 rounded pl-2 bg-transparent   py-2 text-sm  font-semibold  outline-none' >

                            {data?.email}
                        </div>
                    </div>

                </div>

                {/* About */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <MdOutlineReportGmailerrorred />
                    <div>
                        <div className='text-sm px-2'>
                            About
                        </div>
                        <div
                            className='w-full bg-stone-700 rounded pl-2 bg-transparent   py-2 text-sm  font-semibold  outline-none' >

                            {data?.about}
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}

export default OneonOneChat;
