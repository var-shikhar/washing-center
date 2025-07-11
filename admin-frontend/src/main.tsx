import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/context/theme-provider'
import '@/index.css'
import React, { useLayoutEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import Loader from './components/loader'
import { LoaderProvider } from './context/loaderContext'
import { UserProvider, useUserContext } from './context/userContext'
import useRoutes from './router'

const RoutesWrapper = () => {
  const { isLoggedIn } = useUserContext();
  const { routes } = useRoutes();

  useLayoutEffect(() => {
    if (isLoggedIn) {
      const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password'];
      if (authRoutes.includes(window.location.pathname)) {
        window.location.href = '/dashboard';
      }
    } else {
      const appRoutes = ['/dashboard', '/centers', '/users', '/setting/service', '/setting/category', '/setting/vehicle'];
      if (appRoutes.includes(window.location.pathname)) {
        window.location.href = '/auth/sign-in';
      }
    }
  }, [isLoggedIn]);

  return <RouterProvider router={routes} />;
};

const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <LoaderProvider>
          <UserProvider>
            <Loader />
            <RoutesWrapper />
            <Toaster />
          </UserProvider>
        </LoaderProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);