import React from 'react';

const Confirmation = ({handler,setOpenModal}) => {
    return (
      
        <div className="bg-white dark:bg-stone-800 dark:text-white md:p-8 p-4 rounded-md  min-w-[300px] md:w-3xl">
          <h2 className="text-lg w-full">Are you sure to Logout?</h2>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(false);
              }}
              className="bg-gray-100 p-2 rounded-md text-xs text-stone-800 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handler();
                setOpenModal(false);
              }}
              className="bg-red-500 p-2 rounded-md px-4 text-xs text-white hover:bg-red-600"
            >
              Yes
            </button>
          </div>
        </div>
    );
}

export default Confirmation;
