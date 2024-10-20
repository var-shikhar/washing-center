import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUserContext } from '@/context/userContext'
import useAxioRequests from '@/lib/axioRequest'
import ROUTES from '@/lib/routes'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const { HandlePostRequest } = useAxioRequests();
  const { handleLoggedIn } = useUserContext();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const response = await HandlePostRequest({
      data: data,
      route: ROUTES.commonLoginRoute, 
      type: 'post', 
      toastDescription: 'User has loggedin successfully!',
    })
    setIsLoading(false);
    if(response?.status === 200){
      handleLoggedIn(response?.data);
      navigate('../dashboard');
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <div
                      onClick={() => navigate('/auth/forgot-password')}
                      className='text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary'
                    >
                      Forgot password?
                    </div>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center z-0'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase w-max items-center z-10 bg-white m-auto'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Don't have an account, &nbsp; <b className='fw-bold cursor-pointer underline underline-offset-4 hover:text-primary' onClick={() => navigate('../auth/sign-up')}>SignUp Here</b>
                </span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
