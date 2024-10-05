import { Button } from '@/components/custom/button'
import useServiceForm from '@/hooks/service/use-service-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconSquareRoundedMinusFilled, IconSquareRoundedPlusFilled } from '@tabler/icons-react'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

type TServiceFormProps = HTMLAttributes<HTMLDivElement> & {
  formID: string;
  handleConfirmation: () => void;
}

const addonSchema = z.object({
  serviceID: z.string().min(2, { message: "Addon service ID should have at least 2 characters" }),
  price: z.number().min(5, { message: "Addon price must be at least 5" }),
  discPrice: z.number().min(5, { message: "Addon discounted price must be at least 5" }),
});
  
const formSchema = z.object({
  centerID: z.string(),
  id: z.string().optional(),
  serviceID: z.string().min(2, { message: "Service ID should have at least 2 characters" }),
  price: z.number(),
  discPrice: z.number(),
  isCustomizable: z.boolean().optional(),
  addons: z.array(addonSchema).optional(),
}).superRefine((data, ctx) => {
  if (data.discPrice >= data.price) {
    ctx.addIssue({
      path: ['discPrice'],
      message: 'Discounted price must be lower than the service price',
      code: z.ZodIssueCode.custom,
    });
  }

  data.addons?.forEach((addon, index) => {
    if (addon.discPrice >= addon.price) {
      ctx.addIssue({
        path: ['addons', index, 'discPrice'],
        message: 'Addon discounted price must be lower than the addon price',
        code: z.ZodIssueCode.custom,
      });
    }
  });
});

export default function ServiceForm({ className, formID, handleConfirmation, ...props }: TServiceFormProps) {
  const { apiData, defaultValues, selectedFilters, handleFormSubmission, handleFilterChange } = useServiceForm(formID);
 
  const { register, control, handleSubmit, reset, formState: { errors, isValid, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addons",
  });
  
  const [selectedServices, setSelectedServices] = useState<string[]>([] as string[]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    handleFormSubmission(data, handleConfirmation)
  }

  const handleServiceChange = (value: string, index: number) => {
    const updatedSelections = [...selectedServices];
    updatedSelections[index] = value;
    setSelectedServices(updatedSelections);
  };
  
  const handleRemoveAddon = (index: number) => {
    remove(index); 
    const updatedSelections = [...selectedServices];
    updatedSelections.splice(index, 1);  
    setSelectedServices(updatedSelections); 
  };
  

  return (
    <div className={cn('grid gap-6', className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Service Information</h2>

            <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
                <div className="flex-1 mb-4 lg:mb-0">
                    <label className="mt-1 py-2 rounded-md w-full">Vehicle Type</label>
                    <select className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full" value={selectedFilters.vehicle} onChange={(e) => handleFilterChange(e.target.value, 'vehicle')}>
                        <option value={'All'}>All</option>
                        {apiData?.vehicleList?.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 mb-4 lg:mb-0">
                    <label className="mt-1 py-2 rounded-md w-full">Select Service Category</label>
                    <select className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full" value={selectedFilters.category} onChange={(e) => handleFilterChange(e.target.value, 'category')}>
                        <option value={'All'}>All</option>
                        {apiData?.categoryList?.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label className="mt-1 py-2 rounded-md w-full">Service Name</label>
                <select
                    {...register('serviceID')}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                >
                    <option value="" disabled>Select a service</option>
                    {apiData.filteredServiceList.map(service => (
                    <option key={service.id} value={service.id}>
                        {service.name}
                    </option>
                    ))}
                </select>
                {errors.serviceID && (
                    <p className="text-red-600 text-sm">{errors.serviceID.message}</p>
                )}
            </div>
            <div className="mb-4 flex flex-col lg:flex-row lg:space-x-4">
                <div className="flex-1 mb-4 lg:mb-0">
                <label className="mt-1 py-2 rounded-md w-full">Service Price</label>
                <input
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    placeholder='(i.e. 150)'
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                />
                {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
                </div>
                <div className="flex-1 mb-4 lg:mb-0">
                <label className="mt-1 py-2 rounded-md w-full">Discounted Price</label>
                <input
                    type="number"
                    {...register('discPrice', { valueAsNumber: true })}
                    placeholder='(i.e. 100)'
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                />
                {errors.discPrice && <p className="text-red-600 text-sm">{errors.discPrice.message}</p>}
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <h3>Service Addons</h3>
                <IconSquareRoundedPlusFilled className='cursor-pointer hover:ring-2' onClick={() => append({ serviceID: "", price: 0, discPrice: 0 })} />
            </div>
            {fields?.length > 0 && <div className='rounded border p-2 my-2 px-4'>   
                {fields.map((addon, index) => (
                    <div key={addon.id} className='mb-4 flex flex-col items-center lg:flex-row lg:space-x-4'>
                        <div className="flex-1 mb-4 lg:mb-0">
                            <label className="mt-1 py-2 rounded-md w-full">Service Name</label>
                            <select
                                {...register(`addons.${index}.serviceID`)}
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                onChange={(e) => handleServiceChange(e.target.value, index)}
                            >
                                <option value="" disabled>Select a service</option>
                                {apiData.filteredAddonServiceList.map((service) => (
                                    <option
                                    key={service.id}
                                    value={service.id}
                                    disabled={selectedServices.includes(service.id)}  
                                    >
                                    {service.name}
                                    </option>
                                ))}
                            </select>
                            {errors.addons?.[index]?.serviceID && (
                                <p className="text-red-600 text-sm">{errors.addons[index].serviceID.message}</p>
                            )}
                        </div>
                        <div className="flex-1 mb-4 lg:mb-0">
                            <label className="mt-1 py-2 rounded-md w-full">Service Price</label>
                            <input
                                type="number"
                                {...register(`addons.${index}.price`, { valueAsNumber: true })}
                                placeholder='(i.e. 150)'
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                            />
                            {errors.addons?.[index]?.price && <p className="text-red-600 text-sm">{errors.addons?.[index]?.price.message}</p>}
                        </div>
                        <div className="flex-1 mb-4 lg:mb-0">
                            <label className="mt-1 py-2 rounded-md w-full">Discounted Price</label>
                            <input
                                type="number"
                                {...register(`addons.${index}.discPrice`, { valueAsNumber: true })}
                                placeholder='(i.e. 150)'
                                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                            />
                            {errors.addons?.[index]?.discPrice && <p className="text-red-600 text-sm">{errors.addons?.[index]?.discPrice.message}</p>}
                        </div>
                        <IconSquareRoundedMinusFilled className='cursor-pointer hover:ring-2' onClick={() => handleRemoveAddon(index)} />
                    </div>
                ))}  
            </div>}
            <div className="flex items-center mb-4 lg:mb-0">
              <label className="mt-1 py-2 rounded-md w-full" htmlFor='isCustomizable'>Is Customizable</label>
              <div>
                <input
                    type="checkbox"
                    {...register('isCustomizable')}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent hover:ring-2 focus:outline-none w-full"
                />
                {errors.isCustomizable && <p className="text-red-600 text-sm">{errors.isCustomizable.message}</p>}
              </div>
            </div>
            <Button className='mt-2 w-full' type='submit' disabled={!isDirty || !isValid || isSubmitting}>
                {formID === '' ? 'Create New Service' : 'Update Service Details'}
            </Button>
        </form>
    </div>
  );
}
