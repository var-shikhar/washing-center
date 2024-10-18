import { Button } from '@/components/custom/button'
import CustomTooltip from '@/components/custom/customTooltip'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/context/theme-provider'
import useServiceBookingForm from '@/hooks/public/use-service-booking'
import commonFn from '@/lib/commonFn'
import { TService } from '@/lib/commonTypes'
import { cn } from '@/lib/utils'
import { OTPForm } from '@/pages/auth/components/otp-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconSquareRoundedPlusFilled, IconSquareRoundedXFilled } from '@tabler/icons-react'
import { HTMLAttributes, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const { getMaxTimeforInput } = commonFn;

type TBookingFormProps = HTMLAttributes<HTMLDivElement> & {
    bookedService: TService
    centerID: string;
    handleConfirmation: (bookingID: string) => void;
    closingTime: string;
    openingTime: string;
}

const formSchema = z.object({
    userID: z.string(),
    userName: z.string().min(2, { message: "Name should have at least 2 characters" }),
    userPhone: z.string().min(10, { message: "Phone number must be 10 digits" }).max(10, { message: "Phone number must be 10 digits" }),
    bookingDate: z.string(), 
    bookingTime: z.string(),
    message: z.string().min(2, { message: "Message should have at least 2 characters" }),
});

const BookingForm = ({ className, bookedService, closingTime, openingTime, centerID, handleConfirmation, ...props }: TBookingFormProps) => {
    const {theme} = useTheme();
  const { ROUTES, selectedPhase, servicePricing, defaultValues, setSelectedPhase, handleFormSubmission, handleUserAuth, selectedEmail, setSelectedEmail, handleCustomizableAddons, handleOTPConfirmation } = useServiceBookingForm({bookedService: bookedService, centerID: centerID});
  const { register, handleSubmit, reset, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });
  
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, []);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    handleFormSubmission(data, handleConfirmation)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
        {selectedPhase === 0 ?
            <div>
                <Input type='email' className='form-control' placeholder='user@gmail.com' value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)} />
                <Button className='mt-2 w-full' type='button' disabled={selectedEmail === ''} onClick={handleUserAuth}>Next</Button>
            </div>
        : selectedPhase === 1 ? 
            <div className='p-3'>
                <h1 className='text-lg font-semibold tracking-tight'>Verify Your Email</h1>
                <p className='text-sm text-muted-foreground mb-3'>
                    Please enter the authentication code. <br /> 
                    We have sent the authentication code to your email.
                </p>
                <OTPForm submissionURL={ROUTES.publicCommonEmailValidation} submissionType='put' successMessage='Account has verified successfully!' successFn={(userID: string) => handleOTPConfirmation(userID)} />
                <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                    Haven't received it?{' '} &nbsp;
                    <b className='underline underline-offset-4 hover:text-primary' onClick={handleUserAuth} 
                    >Resend a new code.</b>
                </p>
            </div>
        :   <form onSubmit={handleSubmit(onSubmit)} className="sm:p-6 rounded-lg sm:shadow-md shadow-current">
                {selectedPhase === 2 ? 
                    <> 
                        <div className=' font-semibold'>Service Price</div>
                        <hr className='border-[--background] mb-2' />
                        <div className='flex gap-1 flex-col'>
                            <div className='flex justify-between items-center'>
                                <div className='text-muted-foreground'>Base Price</div>
                                <div className='font-semibold text-green-500'>
                                    <del className='text-red-500 text-xs'>₹ {bookedService.price}/-</del> &nbsp; ₹ {bookedService.discPrice}/-
                                </div>
                            </div>
                            {bookedService.addons?.map(option => (
                                <div className={`flex justify-between items-center rounded px-2 ${bookedService.isCustomizable && !servicePricing.serviceAddons?.some(item => item.addonID.toString() === option.serviceID.toString()) && 'line-through bg-red-200 text-red-500 hover:text-red-700 transition duration-300'} `} key={option.serviceID}>
                                    <div className='truncate text-muted-foreground'>{option.serviceName}</div>
                                    <div className='flex gap-2 items-center'>
                                        <div className='font-semibold text-green-500'>
                                            <del className='text-red-500 text-xs'>₹ {option.price}/-</del> &nbsp; ₹ {option.discPrice}/-
                                        </div>
                                        {bookedService.isCustomizable && (
                                            <>
                                                {servicePricing.serviceAddons?.some(item => item.addonID.toString() === option.serviceID.toString()) ? (
                                                    <CustomTooltip 
                                                        isTextOnly
                                                        content={'Remove Addon Service'}
                                                        trigger={<IconSquareRoundedXFilled
                                                            className="cursor-pointer text-red-800" 
                                                            onClick={() => handleCustomizableAddons(option.serviceID, 'remove')}
                                                        />}
                                                    />
                                                ) : (
                                                    <CustomTooltip 
                                                        isTextOnly
                                                        content={'Add Addon Service'}
                                                        trigger={<IconSquareRoundedPlusFilled
                                                            className="cursor-pointer text-green-800" 
                                                            onClick={() => handleCustomizableAddons(option.serviceID, 'add')}
                                                        />}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}                    
                        </div>
                        <hr className='border-[--background] my-2' />
                        <div className='flex justify-between items-center text-lg font-bold'>
                            <div className=''>Total Price</div>
                            <div className='font-semibold text-green-500'>
                                <del className='text-red-500 text-sm'>₹ {servicePricing.totalPrice}/-</del> &nbsp; ₹ {servicePricing.totalDiscountedPrice}/-
                            </div>
                        </div>     
                        <Button className='mt-2 w-full' type='button' onClick={() => setSelectedPhase(3)}>Next</Button>
                    </>
                :   <div className=''>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Booking Details</h2>
                        <div className="mb-4">
                            <label className="mt-1 py-2 rounded-md w-full">User Name</label>
                            <input
                                type="text"
                                {...register('userName')}
                                placeholder='John Doe'
                                className={`mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full ${theme === 'dark' && 'text-primary-foreground'}`}
                            />
                            {errors.userName && <p className="text-red-600 text-sm">{errors.userName.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="mt-1 py-2 rounded-md w-full">User Phone</label>
                            <input
                                type="tel"
                                {...register('userPhone')}
                                placeholder='9898XXXXXX'
                                className={`mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full ${theme === 'dark' && 'text-primary-foreground'}`}
                            />
                            {errors.userPhone && <p className="text-red-600 text-sm">{errors.userPhone.message}</p>}
                        </div>
                        <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
                            <div className="flex-1 mb-4 lg:mb-0">
                                <label className="mt-1 py-2 rounded-md w-full">Booking Date</label>
                                <input
                                    type="date"
                                    {...register('bookingDate')}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full ${theme === 'dark' && 'text-primary-foreground'}`}
                                />
                                {errors.bookingDate && <p className="text-red-600 text-sm">{errors.bookingDate.message}</p>}
                            </div>
                            <div className="flex-1 mb-4 lg:mb-0">
                                <label className="mt-1 py-2 rounded-md w-full">Booking Time</label>
                                <input
                                    type="time"
                                    {...register('bookingTime')}
                                    min={getMaxTimeforInput(openingTime)}
                                    max={getMaxTimeforInput(closingTime)}
                                    className={`mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full ${theme === 'dark' && 'text-primary-foreground'}`}
                                />

                                {errors.bookingTime && <p className="text-red-600 text-sm">{errors.bookingTime.message}</p>}
                            </div>          
                        </div>
                        <div className="mb-4">
                            <label className="mt-1 py-2 rounded-md w-full">Message</label>
                            <textarea
                                {...register('message')}
                                rows={3}
                                className={`mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full ${theme === 'dark' && 'text-primary-foreground'}`}
                            />
                            {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
                        </div>
                        <Button className='mt-2 w-full' type='submit' disabled={!isDirty || !isValid || isSubmitting}>Book Service</Button>
                    </div>
                }
            </form>
        }
    </div>
  );
}


export default BookingForm;