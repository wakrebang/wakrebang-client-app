import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../pages';

export const PATH = {
  Home: '/'
};

export const router = createBrowserRouter([
  {
    path: PATH.Home,
    element: <Home />
  }
]);
