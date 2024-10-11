import { Button } from '@/components/custom/button'
import { PinInput, PinInputField } from '@/components/custom/pin-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import useAxioRequests from '@/lib/axioRequest'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface OTPFormProps extends HTMLAttributes<HTMLDivElement> {
  submissionURL: string;
  submissionType: 'put' | 'post';
  successMessage: string;
  successFn: (userID: string) => void;
}

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Please enter your otp code.' }),
})

export function OTPForm({ className, submissionURL, submissionType = 'put', successMessage = 'OTP has verified successfully!', successFn, ...props }: OTPFormProps) {
  const { HandlePostRequest } = useAxioRequests();
  const [isLoading, setIsLoading] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const response = await HandlePostRequest({
      data: data,
      route: submissionURL, 
      type: submissionType, 
      toastDescription: successMessage,
    })
    setIsLoading(false);
    if(response?.status === 200) successFn(response.data)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <PinInput
                      {...field}
                      className='flex h-10 justify-between'
                      onComplete={() => setDisabledBtn(false)}
                      onIncomplete={() => setDisabledBtn(true)}
                    >
                      {Array.from({ length: 7 }, (_, i) => {
                        if (i === 3)
                          return <Separator key={i} orientation='vertical' />
                        return (
                          <PinInputField
                            key={i}
                            component={Input}
                            className={`${form.getFieldState('otp').invalid ? 'border-red-500' : ''}`}
                          />
                        )
                      })}
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={disabledBtn} loading={isLoading}>
              Verify
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
