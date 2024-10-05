import { Button } from '@/components/custom/button'
import GooglePlacesAutocomplete from '@/components/googleMap'
import useCenterForm from '@/hooks/center/use-center-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type TCenterFormProps = HTMLAttributes<HTMLDivElement> & {
  formID: string;
  handleConfirmation: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  centerName: z.string().min(2, { message: "Name should have at least 2 characters" }),
  centerEmail: z.string().email({ message: "Invalid email format" }),
  centerPhone: z.string().min(10, { message: "Phone number must be 10 digits" }).max(10, { message: "Phone number must be 10 digits" }),
  centerDOI: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" }),
  timing: z.object({
    open: z.string().nonempty({ message: "Opening time is required" }),
    close: z.string().nonempty({ message: "Closing time is required" }),
  }).refine((data) => {
    const openingTime = new Date(`1970-01-01T${data.open}:00`);
    const closingTime = new Date(`1970-01-01T${data.close}:00`);
    return closingTime > openingTime;
  }, {
    message: "Closing time must be later than opening time",
    path: ['close'],  // This will target the 'close' field for error messaging
  })
});

export default function CenterRegistrationForm({ className, formID, handleConfirmation, ...props }: TCenterFormProps) {
  const { currentPhase, defaultValues, setCurrentPhase,  setLocationDetail, handleFormSubmission } = useCenterForm(formID);
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });
  
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    handleFormSubmission(data, handleConfirmation)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {currentPhase === 0 ? (
        <div>
          <GooglePlacesAutocomplete locationDetail={defaultValues} setLocationDetail={setLocationDetail} showAddress={true} mapClass={'h-[300px]'} />
          <Button className='mt-2 w-full' type='button' disabled={defaultValues.address === '' || defaultValues.geoLocation.lat === 0 || defaultValues.geoLocation.long === 0} onClick={() => setCurrentPhase(1)}>Next</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Center Information</h2>

          <div className="mb-4">
            <label className="mt-1 py-2 rounded-md w-full">Center Name</label>
            <input
              type="text"
              {...register('centerName')}
              placeholder='John Doe'
              className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
            />
            {errors.centerName && <p className="text-red-600 text-sm">{errors.centerName.message}</p>}
          </div>

          <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
            <div className="flex-1 mb-4 lg:mb-0">
              <label className="mt-1 py-2 rounded-md w-full">Center Email</label>
              <input
                type="email"
                {...register('centerEmail')}
                placeholder='john@example.com'
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.centerEmail && <p className="text-red-600 text-sm">{errors.centerEmail.message}</p>}
            </div>

            <div className="flex-1 mb-4 lg:mb-0">
              <label className="mt-1 py-2 rounded-md w-full">Center Phone</label>
              <input
                type="text"
                {...register('centerPhone')}
                placeholder='9898XXXXXX'
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.centerPhone && <p className="text-red-600 text-sm">{errors.centerPhone.message}</p>}
            </div>
          </div>

          <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
            <div className="flex-1 mb-4 lg:mb-0">
              <label className="mt-1 py-2 rounded-md w-full">Date of Incorporation</label>
              <input
                type="date"
                {...register('centerDOI')}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.centerDOI && <p className="text-red-600 text-sm">{errors.centerDOI.message}</p>}
            </div>
            <div className="flex-1 mb-4 lg:mb-0">
              <label className="mt-1 py-2 rounded-md w-full">Center Opening Time</label>
              <input
                type="time"
                {...register('timing.open')}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.timing?.open && <p className="text-red-600 text-sm">{errors.timing.open.message}</p>}
            </div>

            <div className="flex-1 mb-4 lg:mb-0">
              <label className="mt-1 py-2 rounded-md w-full">Center Closing Time</label>
              <input
                type="time"
                {...register('timing.close')}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.timing?.close && <p className="text-red-600 text-sm">{errors.timing.close.message}</p>}
            </div>
          </div>
          <Button className='mt-2 w-full' type='submit' disabled={!isValid}>
            {formID === '' ? 'Create New Center' : 'Update Center Details'}
          </Button>
        </form>
      )}
    </div>
  );
}
