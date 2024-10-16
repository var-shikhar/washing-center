import { Button } from '@/components/custom/button'
import CustomDialog from '@/components/custom/customDialog'
import FilterSelect from '@/components/filterSelect'
import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useAdminBooking from '@/hooks/booking/use-admin-booking'
import { useState } from 'react'
import BackendBookingList from './component/adminBookingList'
import BackendBookingForm from './component/backendBookingForm'
import BookingList from './component/bookingList'

const bookingType = [
  {slug: 'booking', label: 'Booking'},
  {slug: 'backend', label: 'Custom Booking'}
]

export default function AdminBookingPanel() {
  const { filteredOBJ, modalToggle, setModalToggle, setSearchTerm, searchTerm, modalData, setModalData, apiData, handleConfirmation, selectedService, setSelectedService, handleBookingDeletion } = useAdminBooking();
  const [activeType, setActiveType] = useState(bookingType[0].slug)

  function handleCenterForm(id: string, title: string){
    setModalToggle(true);
    setModalData({id: id, title: title});
  }

 

  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='flex w-full items-center justify-end space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Content ===== */}
      <Layout.Body className='flex flex-col'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Booking List</h1>
          <p className='text-muted-foreground'>View and manage all your bookings at one place.</p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex gap-4 sm:my-4'>
            <Input
              placeholder='Filter services...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              list={apiData}
              onChange={(value: string) => setSelectedService(value)}
              selectedValue={selectedService}
              slug={{
                label: 'name',
                value: 'id'
              }}
            />
          </div>
          <CustomDialog 
            isOpen={modalToggle}
            setISOpen={setModalToggle}
            hasTrigger
            customWidth='20vw'
            triggerNode={<Button type='button' onClick={() => handleCenterForm('', 'Add New Booking')}>Add New Booking</Button>}
            title={modalData.title}
            contentNode={
              <BackendBookingForm 
                handleConfirmation={() => {
                  handleConfirmation()
                  setModalToggle(!modalToggle)
                }} 
              />
            }
          />
        </div>

        <div className='flex gap-2 items-center my-1 sm:my-3 justify-center sm:justify-start'>
          {bookingType?.map(item => 
            <div 
              key={item.slug}  
              onClick={() => {
                setActiveType(item.slug);
                setSearchTerm('')
              }}
              className={`cursor-pointer p-2 font-semibold rounded transition ${activeType === item.slug ? 'bg-black text-slate-200' : 'border border-black'}`}
            >
              {item.label}
            </div>
          )}
        </div>
        <Separator className='shadow' />
        {activeType === bookingType[0].slug 
          ? <BookingList list={filteredOBJ.bookingList} handleConfirmation={handleConfirmation} handleDeletion={handleBookingDeletion} />
          : <BackendBookingList list={filteredOBJ.backendBookingList} handleConfirmation={handleConfirmation} handleDeletion={handleBookingDeletion} />
        }
      </Layout.Body>
    </Layout>
  )
}