import { Button } from '@/components/custom/button'
import useAxioRequests from '@/lib/axioRequest'
import ROUTES from '@/lib/routes'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type TReschedulingFormProps = HTMLAttributes<HTMLDivElement> & {
  bookingID: string;
  handleConfirmation: () => void;
}

// Define the validation schema
const formSchema = z.object({
    id: z.string(),
    newDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" })
        .refine((dateString) => {
            const selectedDate = new Date(dateString);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate > today;
        }, {
            message: "The date must be greater than today",
        }),
    newTime: z.string().nonempty({ message: "New time is required" })
});

export default function ReschedulingForm({ className, bookingID, handleConfirmation, ...props }: TReschedulingFormProps) {
    const { HandlePostRequest } = useAxioRequests();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            id: bookingID,
            newDate: new Date().toISOString().split('T')[0],
            newTime: new Date().toTimeString().split(' ')[0]
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const response = await HandlePostRequest({ 
            route: ROUTES.commonBookingRescheduleRoute,
            data: data,
            toastDescription: `Booking has rescheduled successfully`,
            type: 'put'
        });
        if(response?.status === 200) handleConfirmation()
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                <label className="mt-1 py-2 rounded-md w-full">New Date</label>
                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('newDate')}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                />
                {errors.newDate && <p className="text-red-600 text-sm">{errors.newDate.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="mt-1 py-2 rounded-md w-full">New Time</label>
                    <input
                        type="time"
                        {...register('newTime')}
                        min={new Date().toTimeString().split(' ')[0]}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                    />
                    {errors.newTime && <p className="text-red-600 text-sm">{errors.newTime.message}</p>}
                </div>

                <Button className='mt-2 w-full' type='submit' disabled={!isValid}>
                    Reschedule Booking
                </Button>
            </form>
        </div>
    );
}
