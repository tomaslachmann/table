import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthenticationContext } from '../contexts';
import DarkModeSwitch from './DarkmodeSwitch';
import { useState } from 'react';

type NavigationLinkProps = {
  path: string;
  title: string;
  showDots?: boolean;
};

function NavigationLink({ path, title, showDots = true }: NavigationLinkProps){
  return(
    <>
      <li>
        <NavLink to={path} className={({ isActive }) => `${isActive ? 'text-blue-600 font-bold dark:text-gray-300' : 'dark:hover:text-gray-300 text-gray-400 hover:text-gray-500 dark:text-gray-400'}`}>
          {title}
        </NavLink>
      </li>
      {
        showDots &&
        <li className="text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </li>
      }
    </>
  );
}

type NavigationButtonProps = {
  title: string;
  onClick: () => void;
};

function NavigationButton({ title, onClick }: NavigationButtonProps){
  return(
    <button onClick={() => onClick()} className="hidden lg:inline-block text-white dark:text-gray-200 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 font-bold">
      {title}
    </button>
  );
}

export default function Navigation(){
  const { isAuthenticated, signOut } = useAuthenticationContext();
  const navigate = useNavigate();
  const [ menuOpen, setMenuOpen ] = useState(false);
  return(
    <header className="w-full">
      <nav className="relative px-4 py-4 flex justify-between items-center dark:bg-gray-800 bg-white">
        <NavLink to='/home' className="text-3xl font-bold leading-none dark:text-gray-300">
			    Builtmind
        </NavLink>
        <div className="lg:hidden">
          <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        {
          isAuthenticated() &&
            <ul className="hidden lg:flex lg:flex lg:items-center lg:space-x-6">
              <NavigationLink path='/home' title='home' />
              <NavigationLink path='/not-working-link' title='something' />
              <NavigationLink path='/some-not-working-link' showDots={false} title='something else' />
            </ul>
        }
        <div className="hidden lg:flex items-center gap-8">
          <DarkModeSwitch />
          {
            isAuthenticated() ? <NavigationButton title='Sign out' onClick={() => signOut()} /> :
              <NavigationButton title='Sign in' onClick={() => navigate('/login')} />
          }
        </div>
      </nav>
      <div className='lg:hidden navbar-menu relative z-50'>

        <nav className={`${menuOpen ? 'left-0' : '-left-full'} transition-all fixed top-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white dark:bg-gray-800 border-r overflow-y-auto`}>
          <div className="flex justify-between items-center mb-8">
            <NavLink to='/home' className="text-3xl font-bold leading-none dark:text-gray-300">
			          Builtmind
            </NavLink>
            <button className="navbar-close" onClick={() => setMenuOpen(false)}>
              <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div>
            {
              isAuthenticated() &&
              <ul className="space-y-6">
                <NavigationLink path='/home' showDots={false} title='home' />
                <NavigationLink path='/not-working-link' showDots={false} title='something' />
                <NavigationLink path='/some-not-working-link' showDots={false} title='something else' />
              </ul>
            }
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              {
                isAuthenticated() ? <NavLink onClick={e => {e.preventDefault(); signOut();}} to='' className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl">Sign out</NavLink> :
                  <div>
                    <NavLink to='/login' className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl">Sign Up</NavLink>
                  </div>
              }
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}