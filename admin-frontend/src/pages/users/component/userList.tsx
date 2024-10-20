import { Button } from '@/components/custom/button';
import CustomDialog from '@/components/custom/customDialog';
import CustomTooltip from '@/components/custom/customTooltip';
import { TPartnerList } from '@/lib/commonTypes';
import { IconTrash } from '@tabler/icons-react';
import React, { startTransition, useState } from 'react';

type TUserListProps = {
  list: TPartnerList[];
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletion: (partnerID: string) => void;
}

const UserList = ({list, toggle, setToggle, handleDeletion}: TUserListProps) => {
  const [selectedPartner, setSelectedPartner] = useState<TPartnerList>({} as TPartnerList)

  return (
    <div className='overflow-x-auto overscroll-y-none'>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 rounded-s py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">S.No.</th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Partner Name</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Partner Phone</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Partner Email</div></th>
            <th className='px-2 py-3 bg-black'><div className="text-left bg-black font-bold text-xs text-white  uppercase tracking-wider w-max">Total Centers</div></th>
            <th className="px-2 rounded-e py-3 text-left font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6">Interact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list?.map((item, index) => (
            <tr key={item.id} className="bg-gray-50 text-gray-900 hover:bg-gray-100">
              <td className="py-4 text-center relative">
                {index + 1}
              </td>
              <td className="py-4 text-center">{item.partnerName}</td>
              <td className="py-4 text-center">{item.partnerEmail}</td>
              <td className="py-4 text-center">{item.partnerPhone}</td>
              <td className="py-4 text-center">{item.totalCenters}</td>
              <td className="py-4">
                <div className='flex justify-center gap-2'>
                    <CustomTooltip 
                      content={'Delete Partner'} 
                      trigger={
                        <IconTrash 
                          className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                          size={'25'} 
                          onClick={() => {
                            startTransition(() => {
                                setSelectedPartner(item)
                                setToggle(true)
                            })
                          }}
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
        title={'Confirm Your Action'}
        customWidth='20vw'
        contentNode={
            <div>
                <div>Are you sure you want to delete {selectedPartner.partnerName} ?</div>
                <small>All their centers and booking will also be deleted!</small>
                <div className="flex justify-end gap-2 my-2">
                    <Button type='button' variant={'outline'} onClick={() => setToggle(false)}>Close</Button>
                    <Button type='button' onClick={() => handleDeletion(selectedPartner.id)}>Delete Partner</Button>
                </div>
            </div>
        }
      />
    </div>
  )
}

export default UserList