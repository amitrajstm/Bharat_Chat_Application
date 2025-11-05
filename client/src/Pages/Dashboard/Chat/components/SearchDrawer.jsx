import React, { useState } from 'react';
import SearchInp from '../../components/smallComponets/SearchInp';
import { MdBackspace, MdClose } from 'react-icons/md';

export default function SearchDrawer({ setOpenModal, messages }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedMessages, setMatchedMessages] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filteredMessages = messages?.filter((message) =>
        message.content.toLowerCase().includes(query.toLowerCase()) ||
        (message.media && message?.media?.fileName.toLowerCase().includes(query.toLowerCase())) // Match media names too
      );
      setMatchedMessages(filteredMessages);
    } else {
      setMatchedMessages([]);
    }
  };

  return (
    <div className="md:w-[400px] w-[80%] bg-white right-0 top-0 transition-all absolute h-full overflow-y-auto dark:bg-stone-800">
      {/* Header with Back/Close Icon */}
      <div className="flex justify-between items-center p-4 border-b mb-3 border-gray-300">
        <MdClose
          onClick={() => setOpenModal(false)}
          className="text-xl cursor-pointer hover:text-gray-600"
        />
        <h2 className="text-lg font-semibold">Search Messages</h2>
        <div></div>
      </div>

      {/* Search Input */}
      <SearchInp
        placeholder="Search Messages"
        onChange={(e) => handleSearch(e.target.value)}
        value={searchQuery}
        className="border-b border-gray-300 px-4  py-2 w-full"
      />

      {/* Matched Messages */}
      <div className="px-4 py-2">
        {matchedMessages.length > 0 ? (
          matchedMessages.map((matchedMessage) => (
            <div key={matchedMessage._id} className="py-2">

              {matchedMessage.media && matchedMessage.media.fileName && (
                <a href={`#${matchedMessage._id}`} onClick={() => setOpenModal(false)} className="flex items-center  hover:bg-gray-100  dark:hover:bg-stone-600 p-2 rounded-lg transition-all">
                  <img
                    src={matchedMessage.media.url}
                    alt={matchedMessage.media.fileName}
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                    {matchedMessage.media.fileName}
                  </span>
                </a>
              )}
              
              {/* Display content  */}
              {!matchedMessage.media && (
                <a
                  href={`#${matchedMessage._id}`}
                  onClick={() => setOpenModal(false)}
                  className="block bg-slate-100 rounded-xl  px-4 py-2 dark:bg-stone-600 text-blue-600 dark:text-gray-200 dark:hover:bg-stone-600   text-sm"
                >
                  {matchedMessage.content || 'No content'}
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No matches found</p>
        )}
      </div>
    </div>
  );
}
