import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import useAxioRequests from '@/lib/axioRequest'
import { TBookingList } from '@/lib/commonTypes'
import ROUTES from '@/lib/routes'
import { startTransition, useState } from 'react'
import { useParams } from 'react-router-dom'

const TrackBookingForm = () => {
    const { id }  = useParams();
    const { HandleGetRequest } = useAxioRequests();
    const [searchText, setSearchText] = useState(id ?? '');
    const [bookingDetail, setBookingDetail] = useState<TBookingList | null>(null);

    async function handleSearchBooking(){
        const response = await HandleGetRequest({route: `${ROUTES.publicCommonServiceBooking}/${searchText}`});
        if(response?.status === 200){
            startTransition(() => {
                setBookingDetail(response.data)
            })
        }

    }

    return (
        <div className='container'>
            <div className='flex justify-between gap-2 items-center m-2 my-10 px-2'>
                <Input
                    placeholder='Enter Booking Id to Find Status...'
                    className='h-9 flex-fill'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button type='button' className='sm:px-10' onClick={handleSearchBooking} disabled={searchText === ''}>Search</Button>
            </div>
            <hr />
            <div className='container sm:pb-5'>
                {bookingDetail !== null && 
                    <div className='flex flex-col gap-2 my-5 sm:flex-row'>
                        <div className='border-b-2 pb-3 sm:border-e-2 sm:border-b-0 sm:py-0  sm:pe-10'>
                            <small className='text-muted-foreground'>Client Details</small>
                            <div className='text-lg font-semibold'>{bookingDetail.clientName}</div>
                            <div>{bookingDetail.clientNumber}</div>
                            <small className='text-muted-foreground'>Appointement Timing</small>
                            <div className='text-lg font-semibold'>{new Date(bookingDetail.appointmentDate).toLocaleDateString('en-GB')}</div>
                            <div>{new Date(`1970-01-01T${bookingDetail.appointmentTime}`).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                })}
                            </div>
                            <small className='text-muted-foreground'>Appointement Status</small>
                            <div className='text-lg font-semibold'>{bookingDetail.status}</div>
                        </div>
                        <div className='flex-grow sm:px-10'>
                            <small className='text-muted-foreground'>Service Detail</small>
                            <div className='text-2xl font-semibold'>{bookingDetail.serviceName}</div>
                            <small className='text-muted-foreground'>Addons</small>
                            {bookingDetail.addonList?.map(option => <div key={option.addonID} className='text-lg font-semibold'>{option.addonName}</div>)}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default TrackBookingForm