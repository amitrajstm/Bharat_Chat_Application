    import { toast } from "react-toastify";
    import axiosInstance from "./axiosInstance";

    //  FETCH ALL NOTIFICATIONS
    export const fetchAllNotifications = async () => {
        try {
            const res = await axiosInstance.get('/notification');
            console.log(res)
            return res.data;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Error fetching notifications');
        }
    }

    // SAVE NOTIFICATIONS
    export const saveNotification = async (data) => {
        try {
            const res = await axiosInstance.post('/notification/save', data);
            console.log(res)
            return res.data;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Error saving notifications');
        }
    }


    // DELETE NOTIFICATIONS
    export const deleteNotification = async (data) => {
        try {
            const res = await axiosInstance.delete('/notification/delete', data);
            console.log(res)
            return res.data;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Error deleting notifications');
        }
    }