import CustomTooltip from '@/components/custom/customTooltip'
import { TService } from '@/lib/commonTypes'
import { IconEdit, IconLock, IconLockOpenOff, IconTrash } from '@tabler/icons-react'

type TBookingListProps = {
  list: TService[];
  handleDelete: (serviceID: string) => void;
  handleUpdate: (serviceID: string, value: boolean) => void;
  handleEdit: (serviceID: string, title: string) => void;
}

const BookingList = ({list, handleEdit, handleDelete, handleUpdate}: TBookingListProps) => {
  return (
    <div className='overflow-x-auto overscroll-y-none'>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 rounded-s py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">S.No.</th>
            <th className="px-2 py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Client Name</th>
            <th className="px-2 py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Booking Date & Time</th>
            <th className="px-2 py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Vehicle Type</th>
            <th className="px-2 py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Price</th>
            <th className="px-2 py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Is Customizable</th>
            <th className="px-2 py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Status</th>
            <th className="px-2 rounded-e py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Interact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list?.map((item, index) => (
            <tr key={item.id} className="bg-gray-50 hover:bg-gray-100">
              <td className="px-2 py-4 text-sm text-gray-900 md:px-6">{index + 1}</td>
              <td className="px-2 py-4 text-sm text-gray-900 md:px-6">{item.serviceName}</td>
              <td className="px-2 py-4 text-sm text-center text-gray-900 md:px-6">{item.categoryName}</td>
              <td className="px-2 py-4 text-sm text-center text-gray-900 md:px-6">{item.vehicleName}</td>
              <td className="px-2 py-4 text-sm text-gray-900 md:px-6">
                <div className="flex items-center justify-center space-x-2">
                  <span className="line-through text-red-500">₹{item.price}</span>
                  <span className='font-bold'>₹{item.discPrice}/-</span>
                </div>
              </td>
              <td className="px-2 py-4 text-sm text-center text-gray-900 md:px-6">{item.isCustomizable ? 'Yes' : 'No'}</td>
              <td className="px-2 py-4 text-sm text-center text-gray-900 md:px-6">{item.isAvailable ? 'Active' : 'In-Active'}</td>
              <td className="px-2 py-4 text-sm text-gray-900 md:px-6">
              <div className='flex gap-2'>
                  <CustomTooltip 
                    content={'Edit Center Details'} 
                    trigger={
                      <IconEdit className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleEdit(item.id, 'Edit Center Details')} />
                    }
                  />
                  <CustomTooltip 
                    content={item.isAvailable ? 'InActivate Center' : 'Activate Center'} 
                    trigger={
                      item.isAvailable
                        ? <IconLock className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleUpdate(item.id, !item.isAvailable)} />
                        : <IconLockOpenOff className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleUpdate(item.id, !item.isAvailable)} />
                    }
                  />
                  <CustomTooltip 
                    content={'Delete Center'} 
                    trigger={
                      <IconTrash className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleDelete(item.id)} />
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingList