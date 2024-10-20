import { Button } from '@/components/custom/button'
import useServiceForm from '@/hooks/data/forms/use-service-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type TServiceFormProps = HTMLAttributes<HTMLDivElement> & {
  formID: string;
  handleConfirmation: () => void;
}
  
const formSchema = z.object({
  id: z.string().optional(),
  serviceName: z.string().min(2, { message: "Service Name should have at least 2 characters" }),
  categoryID: z.string(),
  vehicleID: z.string(),
  serviceDescription: z.string().min(2, { message: "Service Description should have at least 2 characters" }),
});

export default function ServiceForm({ className, formID, handleConfirmation, ...props }: TServiceFormProps) {
  const { apiData, defaultValues, handleFormSubmission  } = useServiceForm(formID);
 
  const { register, handleSubmit, reset, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    handleFormSubmission(data, handleConfirmation)
  }  

  return (
    <div className={cn('grid gap-6', className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Service Information</h2>

            <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
                <div className="flex-1 mb-4 lg:mb-0">
                    <label className="mt-1 py-2 rounded-md w-full">Select Vehicle Type</label>
                    <select 
                      {...register('vehicleID')}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full" 
                    >
                      <option value={''}>Select Vehicle</option>
                      {apiData?.vehicleList?.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 mb-4 lg:mb-0">
                    <label className="mt-1 py-2 rounded-md w-full">Select Category</label>
                    <select 
                      {...register('categoryID')}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full" 
                    >
                      <option value={''}>Select Category</option>
                      {apiData?.categoryList?.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="mb-4">
              <label className="mt-1 py-2 rounded-md w-full">Service Name</label>
              <input
                type="text"
                {...register('serviceName')}
                placeholder='(i.e. 150)'
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.serviceName && <p className="text-red-600 text-sm">{errors.serviceName.message}</p>}
            </div>
            <div className="mb-4">
              <label className="mt-1 py-2 rounded-md w-full">Service Description</label>
              <textarea
                rows={5}
                {...register('serviceDescription')}
                placeholder='(i.e. 150)'
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.serviceDescription && <p className="text-red-600 text-sm">{errors.serviceDescription.message}</p>}
            </div>            
            <Button className='mt-2 w-full' type='submit' disabled={!isDirty || !isValid || isSubmitting}>
                {formID === '' ? 'Create New Service' : 'Update Service Details'}
            </Button>
        </form>
    </div>
  );
}
