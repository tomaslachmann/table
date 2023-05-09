import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { usePrefersDarkMode } from './useMedia';

export default function useDarkMode(): [boolean, (enabled: boolean) => void] {
  const [ enabledState, setEnabledState ] = useLocalStorage<boolean>(
    'dark-mode-enabled',
    true,
  );

  const prefersDarkMode = usePrefersDarkMode();

  const enabled = enabledState !== undefined ? enabledState : prefersDarkMode;

  useEffect(() => {
    const className = 'dark';
    const element = window.document.documentElement;

    if (enabled) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }, [ enabled ]);

  return [ enabled, setEnabledState ];
}
