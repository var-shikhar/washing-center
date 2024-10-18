import { Button } from '@/components/custom/button'
import useAxioRequests from '@/lib/axioRequest'
import ROUTES from '@/lib/routes'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import CONSTANT from '@/lib/constant'

const { bookingStatus } = CONSTANT;

type TReschedulingFormProps = HTMLAttributes<HTMLDivElement> & {
  bookingID: string;
  prevStatus: string;
  handleConfirmation: () => void;
}

// Define the validation schema
const formSchema = z.object({
    id: z.string(),
    statusID: z.string().nonempty({ message: "Status is required" })
});

export default function BookingStatusForm({ className, bookingID, prevStatus, handleConfirmation, ...props }: TReschedulingFormProps) {
    const { HandlePostRequest } = useAxioRequests();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            id: bookingID,
            statusID: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const response = await HandlePostRequest({ 
            route: ROUTES.commonBookingRoute,
            data: data,
            toastDescription: `Status has updated successfully`,
            type: 'put'
        });
        if(response?.status === 200) handleConfirmation()
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="mt-1 py-2 rounded-md w-full">Select Status</label>
                    <select
                        {...register('statusID')}
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                    >
                        {bookingStatus?.map(option => {
                            const isConfirmed = prevStatus === bookingStatus[0].value; // Status is 'Confirmed'
                            const isReserved = prevStatus === bookingStatus[1].value; // Status is 'Reserved'

                            const shouldDisable =
                                (isConfirmed && option.value === bookingStatus[1].value) || // Disable 'Confirmed' if current status is 'Confirmed'
                                (isReserved && (option.value === bookingStatus[0].value || option.value === bookingStatus[1].value)); // Disable 'Reserved' and 'Confirmed' if current status is 'Reserved'

                            return (
                                <option key={option.value} value={option.value} disabled={shouldDisable}>
                                    {option.label}
                                </option>
                            );
                        })}
                    </select>
                    {errors.statusID && <p className="text-red-600 text-sm">{errors.statusID.message}</p>}
                </div>

                <Button className='mt-2 w-full' type='submit' disabled={!isValid}>
                    Update Status
                </Button>
            </form>
        </div>
    );
}
