import { createBrowserRouter } from 'react-router-dom'
import { useUserContext } from './context/userContext.tsx'
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
    path: '/about',
    lazy: async () => ({
      Component: (await import('./pages/landing/about.tsx')).default,
    })
  },
  {
    path: '/track',
    lazy: async () => ({
      Component: (await import('./pages/landing/trackBooking.tsx')).default,
    })
  },
  {
    path: '/track/:id',
    lazy: async () => ({
      Component: (await import('./pages/landing/trackBooking.tsx')).default,
    })
  },
  {
    path: '/center/:id',
    lazy: async () => ({
      Component: (await import('./pages/landing/serviceList.tsx')).default,
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
      Component: (await import('./pages/auth/sign-up.tsx')).default,
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
const centerRoutes = [
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
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'bookings',
        lazy: async () => ({
          Component: (await import('@/pages/booking/admin/adminBooking.tsx')).default,
        }),
      },
      {
        path: 'services',
        lazy: async () => ({
          Component: (await import('@/pages/service/service.tsx')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
    ],
  },
]
const centerAdminRoutes = [
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
          Component: (await import('@/pages/center/center.tsx')).default,
        }),
      },
      {
        path: 'center',
        lazy: async () => ({
          Component: (await import('@/pages/center/center.tsx')).default,
        }),
      },
      {
        path: 'team',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon.tsx')).default,
        }),
      },
    ],
  },
]
const clientRoute = [
  // Main routes
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('@/pages/landing/landing.tsx')).default,
    }),
  },
  {
    path: 'center/:id',
    lazy: async () => ({
      Component: (await import('@/pages/landing/serviceList.tsx')).default,
    }),
  },
  {
    path: '/dashboard',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/booking/user/bookingPanel.tsx')).default,
        }),
      },
    ],
  },
]
export default function useRoutes() {
  const { selectedCenter, userData } = useUserContext();

  // Dynamically choose public or protected routes based on authentication
  const userRoutes = userData?.userRole === 'Client' ? clientRoute : selectedCenter === null ? centerAdminRoutes : centerRoutes;

  // Return the router object
  const routes =  createBrowserRouter([
    ...publicRoutes,
    ...authRoutes,
    ...errorRoutes,
    ...userRoutes,
  ]);

  return {
    routes
  }
}
