import { Link } from 'react-router-dom';
import { useAuthenticationContext } from '../contexts';

export default function NotFound(){
  const { isAuthenticated } = useAuthenticationContext();
  const authenticated = isAuthenticated();
  return(
    <section className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-primary-500">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
          <Link to={authenticated ? '/home' : '/login'} className="inline-flex text-white bg-blue-600 hover:bg-primary-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to { authenticated ? 'Homepage' : 'Sign in' }</Link>
        </div>
      </div>
    </section>
  );
}