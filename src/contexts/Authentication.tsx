import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User, UserPrompt } from '../types';
import { users } from '../data';
import { useNavigate } from 'react-router-dom';

interface AuthenticationContextValue {
  user: User | null;
  signIn: (user: UserPrompt) => void;
  signOut: () => void;
  isAuthenticated: () => boolean;
}

const AuthenticationContext = createContext<AuthenticationContextValue>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  isAuthenticated: () => false,
});

export function useAuthenticationContext(){
  return useContext(AuthenticationContext);
}

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const navigate = useNavigate();
  const [ user, setUser ] = useLocalStorage<User | null>('user', null);

  function isAuthenticated() {
    return user !== null;
  }

  function signIn(userPrompt: UserPrompt){
    const currentUser = users.find(u => u.email === userPrompt.email);

    if(currentUser && currentUser.password === userPrompt.password){
      setUser(currentUser);
      navigate('/home');
    }
  }

  function signOut(){
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthenticationContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationProvider;
