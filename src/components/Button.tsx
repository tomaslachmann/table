import { ButtonVariant } from '../types';

type ButtonProps = {
  type: ButtonVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (val: any) => void;
};

const styles = Object.freeze({
  success: 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-200',
  info: 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-200',
  normal: 'text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:dark:hover:bg-gray-600',
  warn: 'bg-red-600 hover:bg-red-800 text-white',
});

export default function Button({ type, children, onClick, style }: ButtonProps){
  return(
    <button style={style} className={`${styles[type]} inline-flex items-center text-center focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2`} onClick={onClick} >
      { children }
    </button>
  );
}