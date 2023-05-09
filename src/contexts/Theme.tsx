import React, { createContext, useContext } from 'react';
import useDarkMode from '../hooks/useDarkMode';

interface DarkModeContextValue {
  darkMode: boolean;
  toggleDarkMode: (val: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({
  darkMode: false,
  toggleDarkMode: (_val: boolean):void => {},
});

export function useDarkModeContext(){
  return useContext(DarkModeContext);
}

interface DarkModeProviderProps {
  children: React.ReactNode;
}

function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [ darkMode, toggleDarkMode ] = useDarkMode();

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
}

export default DarkModeProvider;
