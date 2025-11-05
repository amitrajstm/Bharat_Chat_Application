import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

// UPDATE AVATAR
export const updateAvatar = async(data) => {
    try{
        const res = await axiosInstance.put(`/user/update/avatar`, data,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
       return res.data;
    }
    catch(err){
        toast.error(err?.response?.data?.message || "Error updating avatar");
    }
}

// DELETE AVATAR
export const deleteAvatar = async() => {
    try{
        const res = await axiosInstance.delete(`/user/delete/avatar`);
        toast.success(res?.data?.message|| "Profile Pic deleted successfully");
        return res.data;
    }
    catch(err){
        toast.error(err?.response?.data?.message || "Error deleting Profile image");
    }
}

// UPDATE PROFILE DATA

export const updateProfile = async(data) => {
    try{
        const res = await axiosInstance.put(`/user/update/profile`, data);
       return res.data;
    }
    catch(err){
        toast.error(err?.response?.data?.message || "Error updating profile");
    }
}

// UPDATE GROUP AVATAR
export const updateGroupAvatar = async(data) => {
    const res = await axiosInstance.put(`/chat/group/updateAvatar`, data,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
   return res.data;
}