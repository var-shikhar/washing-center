import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import MaintenanceError from './pages/errors/maintenance-error'
import NotFoundError from './pages/errors/not-found-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const publicRoutes = [
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('./pages/landing/landing.tsx')).default,
    }),
  },
  {
    path: '/privacy-policy',
    lazy: async () => ({
      Component: (await import('./pages/landing/policy.tsx')).default,
    }),
  },
  {
    path: '/terms-and-condition',
    lazy: async () => ({
      Component: (await import('./pages/landing/termsCondition.tsx')).default,
    }),
  },
]
const authRoutes = [
  {
    path: '/auth/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in.tsx')).default,
    }),
  },
  {
    path: '/auth/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in.tsx')).default,
    }),
  },
  {
    path: '/auth/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/auth/reset-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/reset-password.tsx')).default,
    }),
  },

  // Fallback Route
  {
    path: '*',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in.tsx')).default,
    }),
  },
]
const errorRoutes = [
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError},
]

const adminRoutes = [
  {
    path: '/auth/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        path: 'dashboard',
        lazy: async () => ({
          Component: (await import('./pages/dashboard/index.tsx')).default,
        }),
      },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/pages/users/index.tsx')).default,
        }),
      },
      {
        path: 'centers',
        lazy: async () => ({
          Component: (await import('@/pages/center/index.tsx')).default,
        }),
      },
      {
        path: 'setting/service',
        lazy: async () => ({
          Component: (await import('@/pages/data/service.tsx')).default,
        }),
      },
      {
        path: 'setting/category',
        lazy: async () => ({
          Component: (await import('@/pages/data/category.tsx')).default,
        }),
      },
      {
        path: 'setting/vehicle',
        lazy: async () => ({
          Component: (await import('@/pages/data/vehicle.tsx'))
            .default,
        }),
      },
    ],
  },
]

export default function useRoutes() {
  const routes =  createBrowserRouter([
    ...publicRoutes,
    ...authRoutes,
    ...errorRoutes,
    ...adminRoutes,
  ]);

  return {
    routes
  }
}
