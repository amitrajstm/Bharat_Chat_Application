
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);


// Helper function to get sender details
export const getSenderDetails = (loggedUser, users) => {
    return users?.find((user) => user?._id !== loggedUser?._id);
}

//  DATE STAMPS HELPER FUNCTIONS

export const formatDate = (date) => {
    const messageDate = dayjs(date);
    if (messageDate.isToday()) {
        return 'Today';
    } else if (messageDate.isYesterday()) {
        return 'Yesterday';
    } else {
        return messageDate.format('MMM D, YYYY'); 
    }
};

// Helper function to check if two messages are on the same day
export const isSameDay = (d1, d2) => {
    return dayjs(d1).isSame(d2, 'day');
};

// Time stamp helper

// Helper function to format time (e.g., "10:30 AM")
export const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
};
