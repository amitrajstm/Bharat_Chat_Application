import React, { useEffect, useState } from 'react';
import SearchInp from './SearchInp';
import { MdGroup } from 'react-icons/md';
import { useChatContext } from '../../../../Contexts/ChatProvider';
import { accessChat, createGroupChat, fetchAllUsers } from '../../../../constants/apiCalls';
import Loader from '../../../../common/Loader';
import UsersListShimmer from './Shimmers/UsersListShimmer';
import { useRecoilState } from 'recoil';
import { accessedChat, commonDrawer } from '../../../../atoms/state';
import { IoMdClose } from "react-icons/io";
import { IoArrowBackSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import GroupNameDrawer from './GroupNameDrawer';
import AddToGroup from './AddToGroup';


const CreateGroupDrawer = () => {
    const { allUsers, setAllUsers, handleFetchChats, usersChatLoading } = useChatContext();
    const [loading, setLoading] = useState(false);
    const [createGroupLoading, setCreateGroupLoading] = useState(false);
    const [value, setValue] = useRecoilState(commonDrawer)

    const [allContacts, setAllContacts] = useState([]);   //separate state for all contacts and filters
    const [groupMembers, setGroupMembers] = useState([]);   // Accumulate the selected users

    const [groupDrawerValue, setGroupDrawerValue] = useState("AddToGroup"); // internal Dynamics of drawers


    useEffect(() => {
        setAllContacts(allUsers)
    }, [allUsers])


    //SEARCHING API ONCHANGE
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

    }

    //ACCESS CHAT OR CREATE CHAT
    const handleAddToGroup = (userId) => {
        setGroupMembers((prev) => [...prev, userId]);
        setAllContacts((prev) => prev.filter((user) => user._id !== userId))
    }
    const isSelected = (id) => {
        return groupMembers.includes(id);
    }

    const handleRemoveFromGroup = (userId) => {
        setGroupMembers((prev) => prev.filter((id) => id !== userId));
        setAllContacts((prev) => [...prev, userId])
    }


    // CREATE GROUP
    const handleCreateGroup = async (data) => {
        setCreateGroupLoading(true)
        createGroupChat(data).then((res) => {

            toast.success(res?.data?.message);
            setGroupMembers([]);
            setAllContacts(allUsers);
            handleFetchChats();
            setValue(null);


        })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
            })
            .finally(() => {
                setCreateGroupLoading(false)
            });
    }



    return (
        <>
            {

                groupDrawerValue === "AddToGroup" && (
                    <AddToGroup
                        usersChatLoading={usersChatLoading}
                        allContacts={allContacts}
                        setGroupDrawerValue={setGroupDrawerValue}
                        loading={loading}
                        handleRemoveFromGroup={handleRemoveFromGroup}
                        groupMembers={groupMembers} createGroupLoading={createGroupLoading}
                        handleAddToGroup={handleAddToGroup} isSelected={isSelected}
                        onSearch={onSearch} allUsers={allUsers} setValue={setValue} />
                )
                ||
                groupDrawerValue === "GroupName" && (
                    <GroupNameDrawer
                        handleCreateGroup={handleCreateGroup}
                        createGroupLoading={createGroupLoading}
                        setGroupDrawerValue={setGroupDrawerValue}
                        groupMembers={groupMembers}
                        setGroupMembers={setGroupMembers}
                        setValue={setValue}
                        value={value}
                    />
                )


            }
        </>
    );

}

export default CreateGroupDrawer;
