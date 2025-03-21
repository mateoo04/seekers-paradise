import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './scss/styles.scss';
import 'bootstrap';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import Game from './components/game/Game';
import App from './components/app/App';
import Footer from './components/footer/Footer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/game/:name',
    element: <Game />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Footer />
    <ToastContainer
      position='top-right'
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
      transition={Slide}
    />
  </StrictMode>
);
