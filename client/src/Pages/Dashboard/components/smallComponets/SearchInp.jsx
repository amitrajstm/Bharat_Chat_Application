import React from 'react';
import { IoSearch } from 'react-icons/io5';

const SearchInp = (props) => {
    return (
        <div className='bg-gray-50 dark:bg-stone-700 dark:text-gray-300 flex gap-2 items-center px-4 rounded-full h-10'>
            <IoSearch className='text-gray-800 dark:text-stone-300 text-lg'/>
            <input {...props} type="text" className="w-full h-full px-4 outline-none bg-transparent rounded-lg"  />
        </div>
    );
}

export default SearchInp;
