import CustomDialog from '@/components/custom/customDialog';
import CustomTooltip from '@/components/custom/customTooltip';
import { TBookingList } from '@/lib/commonTypes';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { startTransition, useState } from 'react';

type TBookingListProps = {
  list: TBookingList[];
}

const BookingList = ({list}: TBookingListProps) => {
  const [modalToggle, setModalToggle] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<TBookingList>({} as TBookingList)

  function handleModalToggle(item:TBookingList){
    startTransition(() => {
      setSelectedBooking(item)
      setModalToggle(true)
    })
  }


  const BookingDetail = () => {
    return (
      <div className='rounded bg-slate-300 p-3'>
        <div className='text-2xl font-semibold'>{selectedBooking.serviceName}</div>
        {selectedBooking?.addonList?.length > 0 && 
        <>
          <div className='border-t-2 border-b-2 my-2'>Addon List</div>
          <div className='flex gap-2 flex-col'>
            {selectedBooking?.addonList?.map(item => <b key={item.addonID}>{item.addonName}</b>)}
          </div>
        </>
        }

      </div>
    )
  }

  return (
    <div className='overflow-x-auto overscroll-y-none'>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 rounded-s py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">S.No.</th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Appointment ID</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Appintment Date & Time</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-center bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Booked Service</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Total Amount</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Message</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Status</div></th>
            <th className="px-2 rounded-e py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Interact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list?.map((item, index) => (
            <tr key={item.id} className="bg-gray-50 text-gray-900 hover:bg-gray-100">
              <td className="py-4 text-center relative">
                {item.isRescheduled && <div className='absolute top-0 left-0 rounded-r-sm px-3 text-sm font-semibold bg-red-300 text-red-600'>Rescheduled</div>}
                {index + 1}
              </td>
              <td className="py-4">{item.id}</td>
              <td className="py-4 text-center">
                {new Date(item.appointmentDate).toLocaleDateString('en-GB')} <br />
                {new Date(`1970-01-01T${item.appointmentTime}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })}
              </td>
              <td className="py-4 text-center">{item.serviceName}</td>
              <td className="py-4 text-center">₹ {item.totalAmount}/-</td>
              <td className="py-4">
                <div className='text-center w-28 truncate'>
                  <CustomTooltip 
                    content={item.message} 
                    trigger={<div className='w-[100%] truncate'>{item.message}</div>}
                  />
                </div>
              </td>
              <td className="py-4 text-center">{item.status}</td>
              <td className="py-4">
                <div className='flex justify-center gap-2'>
                  <CustomTooltip 
                    content={'View Booked Services'} 
                    trigger={
                      <IconLayoutDashboard 
                        className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                        size={'25'} 
                        onClick={() => handleModalToggle(item)} 
                      />
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomDialog 
        isOpen={modalToggle}
        setISOpen={setModalToggle}
        hasTrigger={false}
        title={'Booking Details'}
        customWidth='20vw'
        contentNode={<BookingDetail />}
      />
    </div>
  )
}

export default BookingList