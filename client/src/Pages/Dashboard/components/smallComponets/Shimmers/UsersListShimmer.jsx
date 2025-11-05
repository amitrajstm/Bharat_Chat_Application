import React from 'react';

const UsersListShimmer = () => {
    return (
        <div className=' flex items-center bg-transparent  gap-5 cursor-pointer py-2  '
        >
            <div
                className='min-w-12 min-h-12  bg-stone-500 animate-pulse rounded-full ' >
            </div>
            <div className='w-[70%]'>
                <div className='text-md min-h-3  bg-stone-500 animate-pulse rounded-full font-semibold'>
                </div>
                <div className='text-md h-3  bg-stone-500 mt-2 animate-pulse rounded-full font-semibold'>
                </div>
            </div>
        </div>
    );
}

export default UsersListShimmer;
