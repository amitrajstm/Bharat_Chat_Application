import React from 'react';

const TypingLoader = () => {
    return (
        <div className="flex justify-start my-2 items-center w-full">
            <div className="loader bg-stone-100 dark:bg-stone-700 p-2 rounded-full flex space-x-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }}></div>
                <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.6s' }}></div>
            </div>
        </div>
    );
};

export default TypingLoader;
