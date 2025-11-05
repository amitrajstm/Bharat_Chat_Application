import { useEffect, useRef, useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { FaEye } from "react-icons/fa";
import { FaSquarePen, FaUserGroup } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { BsPen, BsThreeDotsVertical } from "react-icons/bs";
import ModalWrapper from '../../../../../common/ModalWrapper'
import { useRecoilState } from 'recoil';
import { accessedChat, userData } from '../../../../../atoms/state';
import OneonOneChat from './OneonOneChat';
import { getSenderDetails } from '../../../Chat/constants';
import { MdAdd } from 'react-icons/md';
import DeleteConfirmation from '../../../../../common/DeleteConfirmation';
import { addUsersToGroupChat, removeUsersFromGroupChat, updateGroupChatDetails } from '../../../../../constants/apiCalls';
import { toast } from 'react-toastify';
import GroupNameDrawer from '../GroupNameDrawer';
import CreateGroupDrawer from '../CreateGroupDrawer';
import AddToGroup from './components/AddToGroup';
import { updateGroupAvatar } from '../../../../../constants/userProfileApiCalls';
import Loader from '../../../../../common/Loader';


const GroupChat = ({ data, setOpenModal }) => {

    const [groupProfileDetails, setGroupProfileDetails] = useState({
        chatName: data?.chatName,
        groupDescription: data?.groupDescription
    });

    const [currProfileData, setProfileData] = useState(data);
    const [isGroupAvatarProfileLoader, setGroupAvatarProfileLoader] = useState(false);
    useEffect(() => {
        setProfileData(data);
        setGroupProfileDetails({
            chatName: data?.chatName,
            groupDescription: data?.groupDescription
        });
    }, [data]);

    const [enableEdit, setEnableEdit] = useState(false);
    const [enableSaveButton, setEnableSaveButton] = useState(false);
    const [updateDetailsLoader, setUpdateDetailsLoader] = useState(false);

    const [openProfileImageModal, setProfileImageModal] = useState(false)
    const [currSelectedChat, setCurrSelectedChat] = useRecoilState(accessedChat);
    const [currUser] = useRecoilState(userData);
    const [isIndividualModalOpen, setIndividualModalOpen] = useState(false);
    const [isOpenRemoveUserFromGroupModal, setOpenRemoveUserFromGroupModal] = useState(false);
    const [isAddUserFromGroupModal, setAddUserFromGroupModal] = useState(false);
    const [currSelectedParticipant, setCurrSelectedParticipant] = useState(null);

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [userToRemove, setUserToRemove] = useState(null);

    const dropdownRef = useRef(null); // for the dropdown

    const toggleDropdown = (userId) => {

        if (activeDropdown === userId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(userId);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveDropdown(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




    // Handle Profile Details Update 
    const detectChange = (groupProfileDetails, data) => {
        return Object.keys(groupProfileDetails).some(key => groupProfileDetails[key] !== data[key])
    }
    const handlerGroupDetailsUpdate = (payload) => {
        if (currUser?._id === data?.groupAdmin?._id) {
            setUpdateDetailsLoader(true)
            updateGroupChatDetails({ chatId: data?._id, ...groupProfileDetails })
                .then((res) => {
                    console.log(res)
                    setCurrSelectedChat(res.chat);
                    setEnableSaveButton(false); 
                    toast.success(res?.message || 'Group Name changed')
                }).finally(() => {
                    setUpdateDetailsLoader(false);
                    setEnableEdit(false);

                })
        } else {
            toast.error('Only Admins can change group name')
        }
    }

    // Handle Remove User From Group
    const handlerRemoveUser = () => {
        if (currUser?._id !== data?.groupAdmin?._id) {
            toast.error('Only Admins can remove user')
            return;
        }
        removeUsersFromGroupChat({ userId: userToRemove, chatId: currProfileData._id })
            .then((res) => {
                toast.success(res?.message);
                setCurrSelectedChat(res.chat)
            }).finally(() => {
                setUserToRemove(null);
            })
    }



    const handleAvatarUpdate = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file.size > 2000000) {
            toast.error("Kindly upload image less than 2mb")
            return;
        }
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("chatId", data?._id);


        setGroupAvatarProfileLoader(true);

        updateGroupAvatar(formData)
            .then((res) => {
                setCurrSelectedChat(res.chat);
            })
            .finally(() => {
                setGroupAvatarProfileLoader(false);
            });
    };



    return (
        <div className='min-h-full max-h-screen w-full relative overflow-y-auto  md:max-w-2xl bg-white dark:bg-stone-800'
            style={{ scrollbarWidth: "none" }}>

            {/* PROFILE MODAL WRAPPER  */}

            <ModalWrapper open={isIndividualModalOpen} setOpenModal={setIndividualModalOpen}>
                <OneonOneChat setOpenModal={setIndividualModalOpen} data={currSelectedParticipant} />
            </ModalWrapper>

            {/* Delete Confirmation MODAL */}
            <ModalWrapper open={isOpenRemoveUserFromGroupModal} setOpenModal={setOpenRemoveUserFromGroupModal}>
                <DeleteConfirmation setOpenModal={setOpenRemoveUserFromGroupModal} handler={handlerRemoveUser} />
            </ModalWrapper>


            {/* header */}
            <div className='flex  sticky bg-white   dark:bg-stone-800 top-0 z-10 py-5 min-w-full items-center justify-between  h-10 p-4'>
                <IoArrowBackSharp onClick={() => setOpenModal(false)} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"Group Profile"}</p>
            </div>

            {/* Profile DP */}
            <div className='w-full py-5 relative px-5'>
                <FaEye
                    onClick={() => setProfileImageModal(true)}
                    title='View Profile Picture'
                    className='absolute top-2 right-10  text-xl hover:dark:text-gray-200 hover:text-stone-700 cursor-pointer' />

                <ModalWrapper open={openProfileImageModal} setOpenModal={setProfileImageModal}>
                    <div className='md:w-[350px] lg:w-[500px] w-[90%] bg-white p-5 dark:bg-stone-800 '
                        style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)' }}>
                        <img src={currProfileData?.groupAvatar} alt={currProfileData?.chatName}
                            className='w-[300px] h-[300px] mx-auto lg:w-[400px] lg:h-[400px] bg-white rounded-lg object-cover' />

                    </div>
                </ModalWrapper>

                <div className='w-32 h-32 mx-auto bg-stone-500 rounded-full p-1 overflow-clip relative'>

                    {
                        isGroupAvatarProfileLoader ?
                            <div className=' absolute top-14 left-1  flex items-start justify-center  w-full'>
                                <Loader />
                            </div>
                            :
                            <>
                                <img
                                    title='View Profile Picture'
                                    onClick={() => setProfileImageModal(true)}
                                    src={currProfileData?.groupAvatar} alt={currProfileData?.chatName}
                                    className='w-full h-full rounded-full cursor-pointer object-cover' />

                                <label htmlFor='avatar' className='absolute cursor-pointer text-sm text-gray-100 rounded-b-full 
                         bg-black opacity-55 hover:opacity-65  text-center inset- w-full bottom-0 h-10 z-10 right-0'>
                                    <p className='my-1 font-semibold'> Change</p>
                                    <input
                                        type="file" name="avatar" accept='image/*' onChange={handleAvatarUpdate} className='hidden'
                                        id='avatar' />
                                </label>
                            </>


                    }
                </div>
            </div>

            {/* Profile Details */}
            <div className='flex flex-col items-center  mt-5  gap-5 px-5 w-full md:max-w-[70%] mx-auto'>

                {/* Group name */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <FaUserGroup />
                    <div>
                        <div className='text-sm px-2'>
                            Group Name
                        </div>
                        <input
                            required
                            disabled={!enableEdit}
                            placeholder='Add Group Name'
                            value={groupProfileDetails?.chatName || currProfileData?.chatName}
                            onChange={(e) => {
                                setGroupProfileDetails((prev) => ({ ...prev, chatName: e.target.value }))
                                setEnableSaveButton(detectChange(groupProfileDetails, data));
                            }
                            }
                            className='w-full border-b bg-stone-700 rounded pl-2 bg-transparent   py-2 text-sm  font-semibold  outline-none' />
                    </div>
                </div>



                {/* Description */}
                <div className='w-full  text-2xl  items-center  px-2 flex gap-5'>
                    <FaInfoCircle />
                    <div>
                        <div className='text-sm px-2'>
                            Description
                        </div>
                        <input
                            required
                            disabled={!enableEdit}
                            placeholder='Add Group Description'
                            value={groupProfileDetails?.groupDescription || currProfileData?.groupDescription}
                            onChange={(e) => {
                                setGroupProfileDetails((prev) => ({ ...prev, groupDescription: e.target.value }))
                                setEnableSaveButton(detectChange(groupProfileDetails, data));
                            }}
                            className='w-full border-b bg-stone-700 rounded pl-2 bg-transparent   py-2 text-sm  font-semibold  outline-none' />
                    </div>

                </div>

            </div>
            <div className='w-full flex gap-4 justify-center'>
                {!enableEdit && <button
                    onClick={() => setEnableEdit(true)}
                    className='bg-blue-500 hover:bg-blue-700 my-5 flex items-center gap-3 text-white px-5 py-1 font-semibold rounded-lg'>
                    <FaSquarePen />  Edit Profile
                </button>}
                {enableEdit &&
                    <button
                        onClick={handlerGroupDetailsUpdate}
                        disabled={!enableSaveButton ||updateDetailsLoader}
                        className={`bg-blue-500 hover:bg-blue-700 my-5 flex items-center gap-3 text-white px-5 py-1 font-semibold rounded-lg ${enableSaveButton ? '' : 'cursor-not-allowed'}`}>
                        {
                            updateDetailsLoader ? <Loader /> : "Save"
                        }
                    </button>
                }
                {enableEdit && <button onClick={
                    () => {
                        setEnableEdit(false);
                    }
                } className='bg-red-500 hover:bg-red-700 my-5 flex items-center gap-3 text-white px-5 py-1 font-semibold rounded-lg'>
                    Cancel
                </button>
                }
            </div>

            {/* Users List */}
            <div className='w-full p-5 relative max-h-screen overflow-y-auto'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-lg my-3 sticky top-0 z-10'>All Participants</h2>
                    <button
                        onClick={() => setAddUserFromGroupModal(true)}
                        className='text-sm font-semibold flex text-white items-center gap-2 bg-green-700 px-3 py-1 rounded-full hover:bg-green-800'>
                        Add More
                        <MdAdd className='text-xl' />
                    </button>
                    {/* Contact List */}
                    <ModalWrapper open={isAddUserFromGroupModal} setOpenModal={setAddUserFromGroupModal}>
                        <AddToGroup groupId={data?._id} setValue={setAddUserFromGroupModal} />
                    </ModalWrapper>

                </div>
                {
                    [...(currProfileData?.users || [])].sort((a, b) => a._id === currProfileData?.groupAdmin?._id ? -1 : 1)
                        ?.map((item) =>
                            <div
                                key={item?._id}
                                onClick={() => {
                                    setCurrSelectedParticipant(item);
                                    setIndividualModalOpen(true)
                                }
                                }
                                className='relative w-full  flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-700 gap-4 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white'
                            >
                                <div className='flex items-center p-1  gap-4 flex-grow '>
                                    <img
                                        src={item?.avatar}
                                        alt={item?.fullName}
                                        className='w-12 h-12 bg-white dark:bg-stone-300 rounded-full'
                                    />
                                    <div className=''>
                                        <h3 className='text-md font-semibold'>
                                            {item?.fullName} {item?._id === currUser?._id && <span className='text-xs text-stone-400 mx-2'>(You)</span>}

                                        </h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-300">{item?.about}</p>
                                    </div>
                                </div>
                                {
                                    item?._id === data?.groupAdmin?._id ? <p className={`text-xs  items-center text-green-500`}>
                                        Admin
                                    </p>
                                        :
                                        currUser?._id === data?.groupAdmin?._id ?
                                            <div className='relative'>
                                                <BsThreeDotsVertical
                                                    className='cursor-pointer hover:text-blue-500'
                                                    onClick={(event) => {
                                                        event.stopPropagation()
                                                        toggleDropdown(item?._id)
                                                    }}
                                                />
                                                {activeDropdown === item?._id && (
                                                    <div ref={dropdownRef}
                                                        className='absolute right-5 text-center z-20 w-[100px] -bottom-3 bg-white dark:bg-stone-700 rounded-lg'
                                                        style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 2px 10px' }}>
                                                        <div onClick={(e) => {
                                                            e.stopPropagation();
                                                            setUserToRemove(item._id);
                                                            setOpenRemoveUserFromGroupModal(true);
                                                        }} className='my-1 p-2 hover:bg-stone-200 dark:hover:bg-red-500 cursor-pointer'>
                                                            Remove
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            : null
                                }


                            </div>
                        )
                }
            </div>

            <div className='bg-red-500 flex text-white items-center mx-auto justify-center rounded-full w-[90%] py-2 hover:bg-red-700 font-bold my-4'>
                Exit Group
            </div>



        </div>
    );
}

export default GroupChat;
