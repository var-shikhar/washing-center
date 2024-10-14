import ThemeSwitch from '@/components/theme-switch';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/user-nav';
import { Layout } from '@/context/layout';
import usePublicBookingPanel from '@/hooks/booking/use-public-booking-panel';
import { Separator } from '@radix-ui/react-select';
import BookingList from './component/bookingList';

const BookingPanel = () => {
    const { filteredList, setSearchTerm, searchTerm  } = usePublicBookingPanel();
  
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
            <div className='w-full flex flex-col gap-4 sm:my-4 sm:flex-row'>
              <Input
                placeholder='Filter services...'
                className='h-9 w-full sm:w-40 sm:w-[250px]'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Separator className='shadow' />
          <BookingList list={filteredList} />
        </Layout.Body>
      </Layout>
    )
}

export default BookingPanel