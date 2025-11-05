import { useEffect, useState, createContext, useContext } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [mode, setMode] = useState(() =>
        localStorage.getItem("mode") ? JSON.parse(localStorage.getItem("mode")) : false
    );

    useEffect(() => {
        if (mode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem("mode", JSON.stringify(mode));
    }, [mode]);

    const toggleMode = () => {
        setMode(prevMode => !prevMode);
    };

    return (
        <DarkModeContext.Provider value={{ mode, toggleMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
