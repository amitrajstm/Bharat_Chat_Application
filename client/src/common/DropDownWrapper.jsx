import { useState, useRef, useEffect } from 'react';

const DropdownWrapper = ({ 
  buttonLabel = 'Dropdown', 
  menuItems = [], 
  position = 'bottom-right' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev)
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="text-stone-600 dark:text-stone-300   inline-flex items-center justify-center text-center p-1 rounded-full"
      >
        {buttonLabel}
        <svg
          className="w-2.5 h-2.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1l4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`z-50 ${isOpen ? 'block' : 'hidden'} bg-white divide-y divide-stone-100 
          rounded-lg shadow w-44 dark:bg-stone-700 border border-stone-800 dark:divide-stone-400 absolute 
          ${position === 'bottom-right' ? 'right-0 mt-2' : 'left-0 mt-2'}`}
    
    style={{boxShadow:'0 0 5px 0 rgba(0, 0, 0, 0.2)'}}>
        <ul className="text-xs text-gray-700 overflow-clip rounded-lg dark:text-gray-200">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  item.handler();
                  setIsOpen(false); 
                }}
                className="block w-full text-left px-4 py-2 my-[3px] hover:bg-gray-100 dark:hover:bg-stone-600 
                  dark:hover:text-white"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownWrapper;
