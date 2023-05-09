import { Route, Outlet } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import ErrorBoundary from '../components/ErrorBoundary';
import CombinedContext from '../contexts';
import NotFound from '../pages/NotFound';
import Navigation from '../components/Navigation';

function Layout(){
  return(
    <CombinedContext>
      <main className="w-full min-h-screen flex flex-col items-center dark:bg-gray-900 bg-gray-50">
        <Navigation />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </CombinedContext>
  );
}

export default function createAppRouter() {
  return (
    <Route path='/*' element={<Layout />}>
      <Route path='*' element={<NotFound/>}/>
      <Route path='home' index element={<Home/>}/>
      <Route path='login' element={<Login/>}/>
    </Route>
  );
}