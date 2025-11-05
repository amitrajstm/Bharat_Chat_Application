
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import Cookies from "universal-cookie";
import axios from 'axios';
import { getCookie } from './cookiesApis';
const cookies = new Cookies(null, { path: '/' });

export const logoutUser = async () => {
    try {
        cookies.remove('authToken');
        toast.success('Logout Success👍');
        window.location.reload();
        return true;
    } catch (error) {
        toast.error('Error in Logging out')
        return false;

    }
}

// FETCH ALL USERS 
export const fetchAllUsers = async (search) => {
    try {
        const res = await axiosInstance.get(`/users/all${search ? `?search=${search}` : ''}`
        )
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error fetching users')
    }
}

// FETCH ALL CHATS
export const fetchAllChats = async () => {
    try {
        const res = await axiosInstance.get(`/chat/all`);
        return res.data;
    } catch (error) {
        console.log(error);
        // toast.error(error?.respose?.data?.message || 'Error fetching chats')
    }
}

// CREATE/ACCESS CHAT
export const accessChat = async (userId) => {
    try {
        const res = await axiosInstance.post(`/chat`, { userId: userId });
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error accessing chat')
    }
}

//CREATE GROUP CHAT
export const createGroupChat = async (data) => {
    try {
        const res = await axiosInstance.post(`/chat/group`, data,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error creating group chat')
    }
}

//UPDATE GROUP CHAT DETAILS
export const updateGroupChatDetails = async (data) => {
    try {
        const res = await axiosInstance.put(`/chat/group/update/details`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error renaming group chat')
    }
}

//ADD USERS TO GROUP CHAT
export const addUsersToGroupChat = async (data) => {
    try {
        const res = await axiosInstance.put(`/chat/group/adduser/new`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error adding users to group chat');
    }
}

//REMOVE USERS FROM GROUP CHAT
export const removeUsersFromGroupChat = async (data) => {
    try {
        const res = await axiosInstance.put(`/chat/group/removeuser`, data);
        return res.data;
    } catch (error) {
        toast.error(error?.respose?.data?.message || 'Error removing user');
    }
}


// FETCH CHAT MESSAGES
export const fetchChatMessages = async (chatId) => {
    try {
        const res = await axiosInstance.get(`/message/${chatId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error fetching chat messages');
    }
}

// FETCH ALL CHATS MESSAGES
export const fetchAllChatsMessages = async () => {
    try {
        const res = await axiosInstance.get(`/message/all`);
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error fetching chat messages');
    }
}


//SEND MESSAGE
export const sendMessage = async (data) => {
    try {
        const res = await axiosInstance.post(`/message`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.respose?.data?.message || 'Error sending message');
    }
}