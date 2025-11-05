import React, { useState, useEffect, useRef } from 'react';

const ContextMenuWrapper = ({ children, options, position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setIsOpen(true);
    console.log(menuPosition)
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className="relative">
      {children}

      {isOpen && (
        <div
          ref={wrapperRef}
          className={`fixed bg-white dark:bg-stone-700 shadow-lg  rounded-md p-1 text-xs z-[500]`}
          style={{ top: `${ menuPosition.y}px`, left: `${menuPosition.x>250 && menuPosition.x}px`,boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                option.onClick();
                setIsOpen(false);
              }}
              className="p-1 px-2 hover:bg-gray-100 dark:hover:bg-stone-800 cursor-pointer rounded-md"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenuWrapper;
