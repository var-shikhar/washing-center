import { Button } from '@/components/custom/button';
import { MultiSelect } from '@/components/custom/filter';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import usePublicCenterList, { TFilterTypes } from '@/hooks/public/use-center-list';
import { IconListDetails, IconMap2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';


const PublicCenterList = () => {
  const { radiusCircle, defaultData, centerList, filteredList, selectedValues, handleSelectionChange, handleRadiusCircle, handleGMapURL } = usePublicCenterList();

  return (
    <>
      <section className="relative my-8">
        <div className="container mx-auto flex flex-col px-4 gap-5 sm:gap-14 items-center">
          <div className='flex gap-2 justify-center flex-wrap w-full sm:justify-end'>
            <MultiSelect 
              title='Vehicle Type' 
              type={'vehicleType'} 
              selectedValues={selectedValues.vehicleType} 
              options={centerList.vehicleList} 
              optionIDSlug='id' 
              optionNameSlug='name' 
              onChange={(type: TFilterTypes, value: string) => {
                handleSelectionChange(type, value)
              }}  
            />
            <MultiSelect 
              title='Category' 
              type={'category'} 
              selectedValues={selectedValues.category} 
              options={centerList.categoryList} 
              optionIDSlug='id' 
              optionNameSlug='name' 
              onChange={(type: TFilterTypes, value: string) => {
                handleSelectionChange(type, value)
              }}  
            />
            <MultiSelect 
              title='Service Type' 
              type={'service'} 
              selectedValues={selectedValues.service} 
              options={centerList.serviceList} 
              optionIDSlug='id' 
              optionNameSlug='name' 
              onChange={(type: TFilterTypes, value: string) => {
                handleSelectionChange(type, value)
              }}  
            />
            {defaultData.lat !== 0 && defaultData.long !== 0 &&
              <Select value={defaultData.radius} onValueChange={(e) => handleRadiusCircle(e)}>
                <SelectTrigger className="w-auto"><SelectValue placeholder="Select Radius" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>{radiusCircle?.map(item => <SelectItem key={item.value} value={item.value.toString()}>{item.label}</SelectItem>)}</SelectGroup>
                </SelectContent>
              </Select>
            }
          </div>
          <div className='mx-2'>
            <div className="flex flex-wrap w-[90vw] sm:w-full mx-auto">
              {filteredList?.length >0 && filteredList.map(item => (
                <div key={item.centerID} className='relative w-full md:w-1/2 lg:w-1/3 p-2'>
                  <div className='rounded-lg border p-4 hover:shadow-md flex flex-col gap-2'> 
                    <div className='my-2 mt-3 flex items-center gap-2 w-full'>
                      <div className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2 font-bold`}>
                        {item?.centerAbbreviation}
                      </div>
                      <h2 className='mb-1 font-semibold text-xl truncate'>{item?.centerName}</h2>
                    </div>
                    <p className='line-clamp-2'>
                      <span className='text-muted-foreground'>Phone:</span>
                      &nbsp;{item?.centerPhone}
                    </p>
                    <p className='line-clamp-2'>
                      <span className='text-muted-foreground'>Distance:</span>
                      &nbsp;{Number(item?.distance).toFixed(3)} meters
                    </p>
                    <small className='line-clamp-2 text-muted-foreground overflow-hidden text-ellipsis whitespace-normal' style={{minHeight: 'calc(2 * 1.2rem)'}}>{item?.centerAddress}</small>
                    <div className='flex gap-2 justify-between'>
                      <Link to={`../center/${item.centerID}`}>
                        <Button type='button'  className='flex gap-2 items-center'>
                          <IconListDetails size={15} />
                          View Services
                        </Button>  
                      </Link>
                      <Button type='button' className='flex gap-2 items-center' variant={'secondary'} onClick={() => handleGMapURL(item?.centerGeoLocation?.lat || 0, item?.centerGeoLocation?.long || 0)}>
                        <IconMap2 size={15} />
                        View Direction
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PublicCenterList