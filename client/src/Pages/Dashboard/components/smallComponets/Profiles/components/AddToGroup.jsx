import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoArrowBackSharp } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import Loader from "../../../../../../common/Loader";
import { useChatContext } from "../../../../../../Contexts/ChatProvider";
import { addUsersToGroupChat } from "../../../../../../constants/apiCalls";
import UsersListShimmer from "../../Shimmers/UsersListShimmer";
import SearchInp from "../../SearchInp";
import { useRecoilState } from "recoil";
import { accessedChat } from "../../../../../../atoms/state";

const AddToGroup = ({ groupId, setValue }) => {

    const { allUsers, setAllUsers } = useChatContext();
    const [loading, setLoading] = useState(false);
    const [createGroupLoading, setCreateGroupLoading] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const[currSelectedChat,setCurrSelectedChat] = useRecoilState(accessedChat)
    const [groupMembers, setGroupMembers] = useState([]);
   

    // Fetching all users on component mount
    useEffect(() => {
        if (allUsers?.length) {
            setAllContacts(allUsers);
        }
    }, [allUsers]);

    // SEARCHING API ONCHANGE
    const onSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (!searchTerm) {
            setAllContacts(allUsers);
        } else {
            setAllContacts(allContacts.filter((user) =>
                user?.fullName?.toLowerCase().includes(searchTerm) ||
                user?.email?.toLowerCase().includes(searchTerm)
            ));
        }
    };

    // Adding user to group members
    const handleAddToGroup = (userId) => {
        if (!groupMembers.includes(userId)) {
            setGroupMembers((prev) => [...prev, userId]);
            setAllContacts((prev) => prev.filter((user) => user._id !== userId));
        }
    };

    // Removing user from group members
    const handleRemoveFromGroup = (userId) => {
        setGroupMembers((prev) => prev.filter((id) => id !== userId));
        const removedUser = allUsers.find((user) => user._id === userId);
        setAllContacts((prev) => [...prev, removedUser]);
    };

    // CREATE GROUP
    const handleCreateGroup = async () => {
        setCreateGroupLoading(true);
        const data = { chatId:groupId, users: groupMembers };
        addUsersToGroupChat(data)
            .then((res) => {
                toast.success(res?.message || "Users Added SuccessFully");
                setGroupMembers([]);
                setCurrSelectedChat(res?.chat);
                setValue(false); 
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
            })
            .finally(() => {
                setCreateGroupLoading(false);
            });
    };
   console.log(currSelectedChat)
    return (
        <div className='min-h-full p-5 max-h-screen w-full relative  overflow-y-auto  md:max-w-2xl bg-white dark:bg-stone-800'>
            {/* Header */}
            <div className='flex min-w-full items-center justify-between h-10 p-4'>
                <IoArrowBackSharp onClick={() => setValue(false)} className='cursor-pointer text-xl' />
                <p className='ml-2 font-semibold text-gray-900 dark:text-gray-300'>{"Add to Group"}</p>
            </div>

            {/* Search */}
            <div className='my-4'>
                <SearchInp onChange={onSearch} placeholder="Search users" />
            </div>

            {/* Selected Users */}
            <div className='flex font-semibold flex-wrap text-xs'>
                {groupMembers?.map((userId) => {
                    const user = allUsers.find((u) => u._id === userId);
                    return (
                        <div
                            key={userId}
                            className='flex m-1 text-white bg-blue-500 rounded-full px-2 items-center gap-2 justify-between'
                        >
                            {user.email.slice(0, 12) + ".."}
                            <IoMdClose onClick={() => handleRemoveFromGroup(userId)} />
                        </div>
                    );
                })}
            </div>

            <div className='dark:bg-stone-700 bg-gray-200 w-full h-[1px]' />

            {/* Create Group Button */}
            <button
                onClick={handleCreateGroup}
                disabled={groupMembers?.length < 1 || createGroupLoading}
                className={`w-full flex items-center justify-center rounded-full border-2 border-stone-600 hover:border-blue-500 bg-stone-800 text-white font-semibold text-sm px-4 py-2 mt-4 ${groupMembers.length < 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                {createGroupLoading ? <Loader /> : "Continue"}
            </button>

            {/* All Users */}
            {loading ? (
                <div className='flex overflow-y-auto relative max-h-[calc(100vh-100px)] flex-col gap-1 mt-2'>
                    {Array(5).fill().map((_, index) => <UsersListShimmer key={index} />)}
                </div>
            ) : (
                <div className='flex overflow-y-auto relative max-h-[calc(100vh-100px)] flex-col gap-1 mt-2'>
                    {allContacts
                    ?.filter((item) => !currSelectedChat?.users?.some((user) => user._id === item._id))
                    .map((item) => (
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
};

export default AddToGroup;
