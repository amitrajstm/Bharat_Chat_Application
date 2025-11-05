import React, { useEffect, useState } from 'react';
import { FaRegSmile, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { IoAdd } from 'react-icons/io5';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { sendMessage } from '../../../constants/apiCalls';
import EmojiPicker from 'emoji-picker-react';
import { useRecoilState } from 'recoil';
import { userData } from '../../../atoms/state';
import { useSocket } from '../../../Contexts/SocketProvider';
import { toast } from 'react-toastify';
import { useChatContext } from '../../../Contexts/ChatProvider';

const MessageArea = ({
  currSelectedChat,
  setMessages,

}) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [currentUser] = useRecoilState(userData);
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
const  {allChatsMessages } = useChatContext();


  //  Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  const handleVoiceInput = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Append recognized speech to message state
  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error detected: " + event.error);
      setIsRecording(false);
    };
  }, [recognition]);



  const handleSendMessage = (file = null) => {
    if (message.trim() || file) {
      const data = new FormData();

      data.append("chatId", currSelectedChat._id);
      data.append("content", message);
      if (file) data.append("media", file);

      sendMessage(data)
        .then((res) => {
          // console.log(all)
          socket?.emit('new message', res.message);
          setMessages((prev) => [...prev, res.message]);
          allChatsMessages?.find((chat) => chat?.chat?._id === currSelectedChat?._id)?.messages?.push(res.message);
          setMessage('');
        })
        .catch((err) => {
          toast.error("Failed to send message");
        });
    }
  };

  // HANDLE TYPING STATE REAL TIME
  const handleChange = (e) => {
    setMessage(e.target.value);
    if (!socket) return;
    
    if (!typing) {
      setTyping(true);
      socket?.emit("typing", { roomId: currSelectedChat?._id, user: currentUser });
    }
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setTyping(false);
        socket?.emit("stop typing", currSelectedChat?._id);
      }, 1000)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onEmojiClick = (event) => {
    setMessage((prev) => prev + event.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file.type !== 'image/jpeg' && file.type !== 'image/jpeg'  && file.type !== 'image/webp' && file.type !== 'image/png' && file.type !== 'image/gif') {
      toast.error('Unsupported file type, Only images are allowed');
      return;
    }
    if (file.size > 10000000) {
      toast.error('File size should be less than 10MB');
      return;
    }
    handleSendMessage(file); 
  };

  return (
    <div className='w-full max-sm:text-xs relative bg-gray-200 border-t dark:border-stone-800 dark:bg-stone-900 dark:text-gray-300 px-3 md:px-6 py-4 h-16 flex items-center'>
      
      {/* Left icons (smile, add icon) */}
      <div className='flex items-center text-xl md:text-2xl text-gray-600 dark:text-gray-300 gap-3'>
        <FaRegSmile className='cursor-pointer' onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
        <label htmlFor="file">
          <IoAdd className='cursor-pointer' />
        </label>
        <input type="file" name="file" id="file" hidden onChange={handleFileChange} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className='absolute bottom-16 left-6 z-10'>
          <EmojiPicker
            height={350}
            emojiStyle="facebook"
            width="17rem"
            lazyLoadEmojis={true}
            onEmojiClick={onEmojiClick} />
        </div>
      )}
      
      {/* Input area */}
      <textarea
        value={message}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder="Type a message"
        className='flex-grow bg-white dark:bg-stone-700 text-gray-800 dark:text-gray-300 resize-none 
          max-h-40 placeholder:py-2 px-4 rounded mx-4 border-0 outline-none'
      />

      <div className=' text-xl md:text-2xl text-gray-600 dark:text-gray-300'>
        {message.trim() ? (
          <RiSendPlane2Fill onClick={() => handleSendMessage()} className='cursor-pointer' />
        ) : (
          <FaMicrophone onClick={handleVoiceInput} className={`cursor-pointer ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
        )}
      </div>
    </div>
  );
}

export default MessageArea;
