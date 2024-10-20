import { Button } from '@/components/custom/button';
import CustomDialog from '@/components/custom/customDialog';
import CustomTooltip from '@/components/custom/customTooltip';
import { TCenterList } from '@/lib/commonTypes';
import { IconPlaylistX, IconStatusChange, IconTrash } from '@tabler/icons-react';
import React, { startTransition, useState } from 'react';

type TCenterListProps = {
  list: TCenterList[];
  type: "pending" | "live";
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleCenterStatus: (centerID: string) => void;
  handleCenterLiveMode: (centerID: string) => void;
  handleDeletion: (centerID: string) => void;
}

const CenterList = ({list, type, toggle, setToggle, handleCenterLiveMode, handleCenterStatus, handleDeletion}: TCenterListProps) => {
  const [modalMode, setModalMode] = useState('Status')
  const [selectedCenter, setSelectedCenter] = useState<TCenterList>({} as TCenterList)

  function handleModalData(item:TCenterList, mode: string){
    startTransition(() => {
      setSelectedCenter(item)
      setModalMode(mode)
      setToggle(!toggle)
    })
  }

  const HandleStatus = () => {
    return (
        <div>
            <div>Are you sure you want to {selectedCenter.isActive ? 'InActivate' : 'Activate'} {selectedCenter.centerName} ?</div>
            <div className="flex justify-end gap-2 mt-3 mx-2">
                <Button type='button' variant={'outline'} onClick={() => setToggle(false)}>Close</Button>
                <Button type='button' onClick={() => handleCenterStatus(selectedCenter.centerID)}>{selectedCenter.isActive ? 'InActivate' : 'Activate'} Center</Button>
            </div>
        </div>
    )
  }

  const HandleListing = () => {
    return (
        <div>
            <div>Are you sure you want to {selectedCenter.isLive ? 'Unlist' : 'list'} {selectedCenter.centerName} ?</div>
            <div className="flex justify-end gap-2 mt-3 mx-2">
                <Button type='button' variant={'outline'} onClick={() => setToggle(false)}>Close</Button>
                <Button type='button' onClick={() => handleCenterLiveMode(selectedCenter.centerID)}>{selectedCenter.isLive ? 'UnList' : 'List'} Center</Button>
            </div>
        </div>
    )
  }

  const HandleDelete = () => {
    return (
        <div>
            <div>Are you sure you want to delete <b>{selectedCenter.centerName}</b> center ?</div>
            <small>All their booking will also be deleted!</small>
            <div className="flex justify-end gap-2 mt-3 mx-2">
                <Button type='button' variant={'outline'} onClick={() => setToggle(false)}>Close</Button>
                <Button type='button' onClick={() => handleDeletion(selectedCenter.centerID)}>Delete Center</Button>
            </div>
        </div>
    )
  }

  return (
    <div className='overflow-x-auto overscroll-y-none'>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 rounded-s py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">S.No.</th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Owner Name</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Center Name</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Center Email & Phone</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Center Address</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Opening/Closing Timing</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Status</div></th>
            <th className="px-2 rounded-e py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Interact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list?.map((item, index) => (
            <tr key={item.centerID} className="bg-gray-50 text-gray-900 hover:bg-gray-100">
              <td className="text-center relative">
                {!item.isActive && <div className='absolute top-0 left-0 rounded-r-sm px-3 text-sm font-semibold bg-red-300 text-red-600'>In-Active</div>}
                {!item.isLive && <div className='absolute top-0 left-0 rounded-r-sm px-3 text-sm font-semibold bg-red-300 text-red-600'>Un-Listed</div>}
                {index + 1}
              </td>
              <td className="text-center">{item.ownerName}</td>
              <td className="text-center">{item.centerName}</td>
              <td className="flex flex-col gap-2 items-center justify-center">
                <div>{item.centerEmail}</div>
                <small>{item.centerPhone}</small>
              </td>
              <td className="">
                <div className='text-center w-28 truncate'>
                  <CustomTooltip 
                    content={item.centerAddress} 
                    trigger={<div className='w-[100%] truncate'>{item.centerAddress}</div>}
                  />
                </div>
              </td>
              <td className=" text-center">{item.centerTiming?.stTime}/{item.centerTiming?.edTime}</td>
              <td className=" text-center">{item.isActive ? 'Active' : 'In-Active'}</td>
              <td className="">
                <div className='flex justify-center gap-2'>
                    {type === 'live' && 
                        <CustomTooltip 
                            content={item.isActive ? 'In-Activate Center' : 'Activate Center'} 
                            trigger={
                            <IconStatusChange 
                                className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                                size={'25'} 
                                onClick={() => handleModalData(item, 'Status')} 
                            />
                            }
                        />
                    }
                    <CustomTooltip 
                        content={item.isLive ? 'Unlisted Center' : 'List Center'} 
                        trigger={
                        <IconPlaylistX 
                            className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                            size={'25'} 
                            onClick={() => handleModalData(item, 'Live')} 
                        />
                        }
                    />
                    <CustomTooltip 
                        content={'Delete Booking'} 
                        trigger={
                        <IconTrash 
                            className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                            size={'25'} 
                            onClick={() => handleModalData(item, 'Delete')}
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
        isOpen={toggle}
        setISOpen={setToggle}
        hasTrigger={false}
        title={modalMode === 'Status' ? `${selectedCenter.isActive ? 'InActivate' : 'Activate'} Center` : modalMode === 'Live' ? `${selectedCenter.isLive ? 'Unlist' : 'List'} Center` : 'Delete Center'}
        customWidth='20vw'
        contentNode={
          <>{
            modalMode === 'Status' 
            ? <HandleStatus />
            : modalMode === 'Live' 
            ? <HandleListing />
            : <HandleDelete />
          }</>
        }
      />
    </div>
  )
}

export default CenterList