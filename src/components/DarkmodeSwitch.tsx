import { MdOutlineWbSunny, MdDarkMode } from 'react-icons/md';
import { useDarkModeContext } from '../contexts';

export default function DarkModeSwitch(){
  const { darkMode, toggleDarkMode } = useDarkModeContext();

  function handleDarkMode(){
    toggleDarkMode(!darkMode);
  }

  return(
    <button
      className="w-10 h-4 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
      onClick={() => handleDarkMode()}
    >
      <div
        id="switch-toggle"
        className={`${darkMode ? 'translate-x-full bg-gray-800' : '-translate-x-2 bg-yellow-300'} relative rounded-full transition duration-500 transform p-1 text-white`}
      >
        {
          darkMode ? <MdDarkMode /> : <MdOutlineWbSunny />
        }
      </div>
    </button>
  );
}