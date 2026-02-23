import { createHashRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Tempering from './pages/Tempering';
import Catalog from './pages/Catalog';

export const router = createHashRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/calculadora',
    Component: Calculator,
  },
  {
    path: '/temperagem',
    Component: Tempering,
  },
  {
    path: '/catalogo',
    Component: Catalog,
  },
  {
    path: '*',
    Component: Dashboard,
  },
]);