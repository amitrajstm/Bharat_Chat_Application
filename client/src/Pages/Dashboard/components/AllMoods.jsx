import React from 'react';
import { IoAdd, IoAddCircle } from 'react-icons/io5';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { RiAddBoxFill } from "react-icons/ri";
const AllMoods = () => {
    return (
        <div className=' w-full relative bg-slate-50 dark:bg-stone-700'>
            <div className='sticky top-0 z-10 bg-white dark:bg-stone-800 pb-4 '>

                <div className='flex items-center  justify-between'>

                    <h2 className='text-2xl  font-bold text-gray-900 dark:text-gray-300'>
                        Moods
                    </h2>

                    <div className='flex items-center gap-5'>

                        <IoAdd title='Add Mood' className='text-2xl cursor-pointer hover:text-blue-400 text-blue-600' />
                        <PiDotsThreeOutlineVerticalFill title='Options' className='text-xl cursor-pointer hover:text-gray-400 text-gray-600' />
                    </div>
                </div>

                <div className='flex items-center  gap-5 my-2 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white'
                >
                    <div className='relative'>
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt=""
                            className='w-12 h-12  bg-black rounded-full' />
                        <IoAddCircle className='text-xl text-blue-500 p-[1px] bg-white dark:bg-stone-700 rounded-full absolute bottom-0 right-0' />
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold'>
                            My Mood
                        </h3>
                        <p className='text-xs text-gray-400'>
                            click to update the mood
                        </p>
                    </div>
                </div>

            </div>

            {/* groups */}
            <div className='flex overflow-y-scroll h-full mt-2 bg-white dark:bg-stone-800 relative max-h-[calc(100vh-100px)] flex-col gap-2'
                style={{ scrollbarWidth: 'none', scrollbarColor: 'blue' }}>
                <h3 className='my-4 px-2 text-lg'>RECENT</h3>

                {[1, 2].map((item) =>
                    <div key={item} className='flex items-center hover:bg-stone-100 gap-5 cursor-pointer py-2 bg-white dark:bg-stone-800 dark:text-white'
                    >
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt=""
                            className='w-12 h-12  bg-black rounded-full' />
                        <div>
                            <h3 className='text-lg font-semibold'>
                                Aniket Gupta
                            </h3>
                            <p className='text-xs text-gray-400'>
                                Last message
                            </p>
                        </div>
                    </div>)
                }

            </div>


        </div>
    );
}

export default AllMoods;
