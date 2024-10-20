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
import useAxioRequests from '@/lib/axioRequest'
import ROUTES from '@/lib/routes'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {
    token: string;
}

const formSchema = z.object({
    isMaster: z.boolean(), 
    password: z.string()
      .min(1, { message: 'Please enter your password' })
      .min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
});

export function ResetForm({ className, token, ...props }: ForgotFormProps) {
  const { HandlePostRequest } = useAxioRequests();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
        password: '',
        confirmPassword: '', 
        isMaster: true,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await HandlePostRequest({
      data: {...data, token: token, isMaster: true},
      route: ROUTES.commonForgotPasswordRoute, 
      type: 'put', 
      toastDescription: 'Password has been updated successfully!',
    });
    
    setIsLoading(false);
    
    if (response?.status === 200) {
      navigate('../auth/sign-in');
    } else {
      console.error(response); // Log the error for debugging
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' type='submit' loading={isLoading} disabled={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
