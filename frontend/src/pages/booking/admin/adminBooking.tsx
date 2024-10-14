import { Button } from '@/components/custom/button'
import CustomDialog from '@/components/custom/customDialog'
import FilterSelect from '@/components/filterSelect'
import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useAdminBooking from '@/hooks/booking/use-admin-booking'
import CONSTANT from '@/lib/constant'
import BackendBookingForm from './component/backendBookingForm'
import BookingList from './component/bookingList'

const { sortingList } = CONSTANT;


export default function AdminBookingPanel() {
  const { filteredList,  modalToggle,  selectedSort, setModalToggle, setSearchTerm, searchTerm, setSelectedSort, modalData, setModalData, apiData, handleConfirmation, selectedService, setSelectedService } = useAdminBooking();

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
          <h1 className='text-2xl font-bold tracking-tight'>
            Booking List
          </h1>
          <p className='text-muted-foreground'>
            View and manage all your bookings at one place.
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter services...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              list={sortingList}
              onChange={(value: string) => setSelectedSort(value)}
              selectedValue={selectedSort}
              slug={{
                label: 'label',
                value: 'value'
              }}
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
        <Separator className='shadow' />
        <BookingList list={filteredList} handleConfirmation={handleConfirmation} />
      </Layout.Body>
    </Layout>
  )
}