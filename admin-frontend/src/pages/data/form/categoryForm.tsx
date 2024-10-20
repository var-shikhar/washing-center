import { Button } from '@/components/custom/button'
import useCategoryForm from '@/hooks/data/forms/use-category-form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type TCategoryFormProps = HTMLAttributes<HTMLDivElement> & {
  formID: string;
  handleConfirmation: () => void;
}
  
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Category Name should have at least 2 characters" }),
});

export default function CategoryForm({ className, formID, handleConfirmation, ...props }: TCategoryFormProps) {
  const { defaultValues, handleFormSubmission  } = useCategoryForm(formID);
 
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
            <div className="mb-4">
              <label className="mt-1 py-2 rounded-md w-full">Category Name</label>
              <input
                type="text"
                {...register('name')}
                placeholder='(i.e. 150)'
                className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>           
            <Button className='mt-2 w-full' type='submit' disabled={!isDirty || !isValid || isSubmitting}>
                {formID === '' ? 'Create New Service' : 'Update Service Details'}
            </Button>
        </form>
    </div>
  );
}
