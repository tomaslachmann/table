import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import createAppRouter from './routes';
import './App.css';

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(createAppRouter()));

  return (
    <RouterProvider router={router} />
  );
}