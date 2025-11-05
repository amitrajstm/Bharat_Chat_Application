import {atom} from 'recoil';

export const userData = atom({   // FOR USER DATA
    key: 'userData', 
    default: null,
  });

export const accessedChat = atom({  //  FOR THE CHAT AREA
    key: 'accessedChat', 
    default: localStorage.getItem('accessedChat') ? JSON.parse(localStorage.getItem('accessedChat')) : null,
  });

  export const allChatsMessagesState= atom({
    key: 'allChatsMessagesState', 
    default: [],
  })

export const sideBarTab = atom({  // SIDE BAR TAB
    key: 'sideBarTab', 
    default: 'Chats',
  });
export const commonDrawer = atom({  // COMMON DRAWER
    key: 'commonDrawer', 
    default: null,
  });

export const onlineUsersState = atom({
  key :'onlineUsersState',
  default:[]
})