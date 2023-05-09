import { useState, useEffect } from 'react';

export function useMedia(query: string): boolean {
  const [ matches, setMatches ] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    function handleChange(event: MediaQueryListEvent){
      setMatches(event.matches);
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [ query ]);

  return matches;
}

export function usePrefersDarkMode(): boolean {
  return useMedia('(prefers-color-scheme: dark)');
}
