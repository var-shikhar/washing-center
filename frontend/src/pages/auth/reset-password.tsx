import { Card } from '@/components/ui/card';
import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResetForm } from './components/reset-form';
import { useUserContext } from '@/context/userContext';

export default function ResetPassword() {
    const location = useLocation();
    const { isLoggedIn } = useUserContext();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null)

    useLayoutEffect(() => {
      if(isLoggedIn){
        navigate('../')
      }
    }, [isLoggedIn])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        startTransition(() => {
            setToken(token)
        })        
    }, [location])
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            <h1 className='text-xl font-medium'>Washing Center  </h1>
          </div>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-md font-semibold tracking-tight'>
                Reset Password
              </h1>
            </div>
            <ResetForm token={token} />
          </Card>
        </div>
      </div>
    </>
  )
}
