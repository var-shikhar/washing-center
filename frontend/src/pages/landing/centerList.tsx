import { Button } from '@/components/custom/button'
import { MultiSelect } from '@/components/custom/filter'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import usePublicCenterList, { TFilterTypes } from '@/hooks/public/use-center-list'
import { Link } from 'react-router-dom'
import Footer from './component/footer'
import Header from './component/header'


const PublicCenterList = () => {
  const { radiusCircle, defaultData, centerList, filteredList, selectedValues, handleSelectionChange, handleRadiusCircle } = usePublicCenterList();


  console.log(filteredList)
  return (
    <>
      <Header activeHeader="Home" />
      <section className="relative my-44">
        <div className="container mx-auto flex flex-col gap-14 items-center">
          <div className="text-5xl">View Washing Centers</div>
          <div className='flex gap-2 justify-end w-full'>
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
            <Select value={defaultData.radius} onValueChange={(e) => handleRadiusCircle(e)}>
              <SelectTrigger className="w-auto"><SelectValue placeholder="Select Radius" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>{radiusCircle?.map(item => <SelectItem value={item.value.toString()}>{item.label}</SelectItem>)}</SelectGroup>
              </SelectContent>
            </Select>
            {/* <MultiSelect 
              title='Service Type' 
              type={'service'} 
              selectedValues={selectedValues.service} 
              options={centerList.serviceList} 
              optionIDSlug='id' 
              optionNameSlug='name' 
              onChange={(type: TFilterTypes, value: string) => {
                console.log(type)
                console.log(value)
                handleSelectionChange(type, value)
              }}  
            /> */}
          </div>
          <div className="no-scrollbar grid gap-4 overflow-auto md:grid-cols-2 lg:grid-cols-3">
            {filteredList?.length >0 && filteredList.map(item => (
              <div key={item.centerID} className='relative rounded-lg border p-4 hover:shadow-md flex flex-col gap-2'>
                <div className='my-2 mt-3 flex items-center gap-2'>
                  <div className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2 font-bold`}>
                    {item?.centerAbbreviation}
                  </div>
                  <h2 className='mb-1 font-semibold text-xl'>{item?.centerName}</h2>
                </div>
                <p className='line-clamp-2 text-gray-900'>Phone: {item?.centerPhone}</p>
                <small className='line-clamp-2 text-gray-500'>{item?.centerAddress}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative bg-[--deep-purple] p-16">
        <div className="container mx-auto sm:px-28">
          <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg py-16 px-12 relative z-10">
            <div className="w-full text-center lg:w-8/12">
              <p className="text-4xl text-center">
                <span role="img" aria-label="love">
                  😍
                </span>
              </p>
              <h3 className="font-semibold text-3xl">
                Join Our Platform Today!
              </h3>
              <p className=" text-lg mt-4 mb-4">
                Ready to take your washing center to the next level? Sign up now and become part of our growing community of successful washing centers. Together, we can redefine the washing experience for your customers!
              </p>
              <Link to={'../auth/sign-up'}>
                <Button type="button" size={"lg"}>
                  Start Your Washing Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default PublicCenterList