import { Button } from '@/components/custom/button'
import CustomTooltip from '@/components/custom/customTooltip'
import useBackendServiceBookingForm from '@/hooks/booking/use-booking-form.'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconSquareRoundedPlusFilled, IconSquareRoundedXFilled } from '@tabler/icons-react'
import { HTMLAttributes, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type TBookingFormProps = HTMLAttributes<HTMLDivElement> & {
    handleConfirmation: () => void;
}

const formSchema = z.object({
    userName: z.string().min(2, { message: "Name should have at least 2 characters" }),
    userPhone: z.string().min(10, { message: "Phone number must be 10 digits" }).max(10, { message: "Phone number must be 10 digits" }),
    userEmail: z.string().min(1, { message: 'Please enter your email' }).email({ message: 'Invalid email address' }),
    bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" }), 
    bookingTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, { message: "Invalid time format" }),
    message: z.string().min(2, { message: "Message should have at least 2 characters" }),
});

const BackendBookingForm = ({ className, handleConfirmation, ...props }: TBookingFormProps) => {
  const { selectedPhase, servicePricing, defaultValues, serviceList, selectedService, setSelectedService, setSelectedPhase, handleFormSubmission, handleCustomizableAddons } = useBackendServiceBookingForm();
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
            {selectedPhase === 0 ? <>
                <select 
                    className='form-control w-[100%] p-2 border my-5'
                    value={JSON.stringify(selectedService)} 
                    onChange={(e) => setSelectedService(JSON.parse(e.target.value))}
                >
                    <option value={''}>Select Service</option>
                    {serviceList.map((service) => (
                        <option key={service.id} value={JSON.stringify(service)}>
                            {service.serviceName}
                        </option>
                    ))}
                </select>
                {selectedService !== null && 
                    <div className='sm:px-2'>
                        <div className='text-black font-semibold'>Service Price</div>
                        <hr className='border-black mb-2' />
                        <div className='flex gap-1 flex-col'>
                            <div className='flex justify-between items-center'>
                                <div className=''>Base Price</div>
                                <div className='font-semibold text-green-500'>
                                    <del className='text-destructive text-xs'>₹ {selectedService.price}/-</del> &nbsp; ₹ {selectedService.discPrice}/-
                                </div>
                            </div>
                            {selectedService.addons?.map(option => (
                                <div className={`flex justify-between items-center rounded px-2 ${selectedService.isCustomizable && !servicePricing.serviceAddons?.some(item => item.addonID.toString() === option.serviceID.toString()) && 'line-through bg-red-200 text-red-500 hover:text-red-700 transition duration-300'} `} key={option.serviceID}>
                                    <div className='truncate'>{option.serviceName}</div>
                                    <div className='flex gap-2 items-center'>
                                        <div className='font-semibold text-green-500'>
                                            <del className='text-destructive text-xs'>₹ {option.price}/-</del> &nbsp; ₹ {option.discPrice}/-
                                        </div>
                                        {selectedService.isCustomizable && (
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
                        <hr className='border-black my-2' />
                        <div className='flex justify-between items-center text-lg font-bold'>
                            <div className='text-black'>Total Price</div>
                            <div className='font-semibold text-green-500'>
                                <del className='text-destructive text-sm'>₹ {servicePricing.totalPrice}/-</del> &nbsp; ₹ {servicePricing.totalDiscountedPrice}/-
                            </div>
                        </div>     
                        <Button className='mt-2 w-full' type='button' onClick={() => setSelectedPhase(3)}>Next</Button>
                    </div>
                }
            </>
            :   <div>
                    <h2 className="text-2xl font-semibold mb-6 text-center">Booking Details</h2>
                    <div className="mb-4">
                        <label className="mt-1 py-2 rounded-md w-full">User Name</label>
                        <input
                            type="text"
                            {...register('userName')}
                            placeholder='John Doe'
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                        />
                        {errors.userName && <p className="text-red-600 text-sm">{errors.userName.message}</p>}
                    </div>
                    <div className='flex gap-2'>
                        <div className="mb-4 flex-1">
                            <label className="mt-1 py-2 rounded-md w-full">User Phone</label>
                            <input
                                type="tel"
                                {...register('userPhone')}
                                placeholder='9898XXXXXX'
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                            />
                            {errors.userPhone && <p className="text-red-600 text-sm">{errors.userPhone.message}</p>}
                        </div>
                        <div className="mb-4 flex-1">
                            <label className="mt-1 py-2 rounded-md w-full">User Email</label>
                            <input
                                type="email"
                                {...register('userEmail')}
                                placeholder='john@example.com'
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                            />
                            {errors.userEmail && <p className="text-red-600 text-sm">{errors.userEmail.message}</p>}
                        </div>
                    </div>
                    <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
                        <div className="flex-1 mb-4 lg:mb-0">
                            <label className="mt-1 py-2 rounded-md w-full">Booking Date</label>
                            <input
                            type="date"
                            {...register('bookingDate')}
                            min={new Date().toISOString().split('T')[0]}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                            />
                            {errors.bookingDate && <p className="text-red-600 text-sm">{errors.bookingDate.message}</p>}
                        </div>
                        <div className="flex-1 mb-4 lg:mb-0">
                            <label className="mt-1 py-2 rounded-md w-full">Booking Time</label>
                            <input
                                type="time"
                                {...register('bookingTime')}
                                min={new Date().toTimeString().split(' ')[0]}
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                            />
                            {errors.bookingTime && <p className="text-red-600 text-sm">{errors.bookingTime.message}</p>}
                        </div>          
                    </div>
                    <div className="mb-4">
                        <label className="mt-1 py-2 rounded-md w-full">Message</label>
                        <textarea
                            {...register('message')}
                            rows={3}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                        />
                        {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
                    </div>
                    <Button className='mt-2 w-full' type='submit' disabled={!isDirty || !isValid || isSubmitting}>Book Service</Button>
                </div>
            }
        </form>
    </div>
  );
}


export default BackendBookingForm;