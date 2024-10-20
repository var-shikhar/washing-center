import { Button } from '@/components/custom/button'
import CustomDialog from '@/components/custom/customDialog'
import CustomTooltip from '@/components/custom/customTooltip'
import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useVehiclePanel from '@/hooks/data/use-vehicle-panel'
import { TServiceVehicle } from '@/lib/commonTypes'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { startTransition, useState } from 'react'
import VehicleForm from './form/vehicleForm'

export default function VehiclePanel() {
    const { filteredList, modalToggle, searchTerm, setSearchTerm, setModalToggle, handleVehicleDeletion, handleConfirmation } = useVehiclePanel();
    const [selectedID, setSelectedID] = useState({
        id: '',
        name: '',
        type: '',
        title: '',
    })

    function handleListAction(id: string, name: string, title: string, type: string){
        startTransition(() => {
            setModalToggle(!modalToggle);
            setSelectedID({id, name, type, title});
        })
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
                <h1 className='text-2xl font-bold tracking-tight'>Vehicle List Panel</h1>
                <p className='text-muted-foreground'>View and create all your vehicle at one place.</p>
                </div>
                <div className='my-4 flex items-end justify-between sm:items-center'>
                    <Input
                        placeholder='Filter vehicle by name...'
                        className='h-9 w-40 lg:w-[250px]'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type='button' onClick={() => handleListAction('', '', 'Add New Vehicle', 'Add')}>Add New Vehicle</Button>
                </div>
                <Separator className='shadow' />
                <VehicleList 
                    list={filteredList} 
                    handleDelete={(vehicleID: string, name: string) => handleListAction(vehicleID, name, 'Delete Vehicle', 'Delete')} 
                    handleEdit={(vehicleID: string, name: string) => handleListAction(vehicleID, name, 'Edit Vehicle', 'Edit')} />
                <CustomDialog 
                    isOpen={modalToggle}
                    setISOpen={setModalToggle}
                    hasTrigger={false}
                    customWidth='20vw'
                    title={selectedID.title}
                    contentNode={
                        <div>
                            {selectedID.type === 'Delete' ? 
                                <div>
                                    <div>Are you sure you want to {selectedID.type} {selectedID.name} ?</div>
                                    <div className="flex justify-end gap-2 sm:mt-5 sm:me-5 my-2">
                                        <Button type='button' variant={'outline'} onClick={() => setModalToggle(false)}>Close</Button>
                                        <Button type='button' onClick={() =>  handleVehicleDeletion(selectedID.id)}>Delete Vehicle</Button>
                                    </div>
                                </div>
                            : <VehicleForm formID={selectedID.id} handleConfirmation={handleConfirmation} /> }
                        </div>
                    }
                />                
            </Layout.Body>
        </Layout>
    )
}

type TVehicleListProps = {
    list: TServiceVehicle[];
    handleDelete: (vehicleID: string, name: string) => void;
    handleEdit: (vehicleID: string, name: string) => void;
}

const VehicleList = ({ list, handleEdit, handleDelete } :TVehicleListProps) => {
    return (
        <div className='overflow-x-auto overscroll-y-none'>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-2 rounded-s py-3 font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6 text-center">S.No.</th>
                    <th className='px-2 py-3 bg-black'><div className="text-left font-bold text-xs text-white  uppercase tracking-wider w-max">Vehicle Name</div></th>
                    <th className="px-2 rounded-e py-3 font-bold text-xs text-white text-center bg-black uppercase tracking-wider md:px-6">Interact</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {list?.map((item, index) => (
                    <tr key={item.id} className="bg-gray-50 text-gray-900 hover:bg-gray-100">
                        <td className="py-3 text-center relative">{index + 1}</td>
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">
                            <div className='flex justify-center gap-2'>
                                <CustomTooltip 
                                    content={'Edit Vehicle'} 
                                    trigger={
                                        <IconEdit    
                                            className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                                            size={'25'} 
                                            onClick={() => handleEdit(item.id, item.name)}
                                        />
                                    }
                                />
                                <CustomTooltip 
                                    content={'Delete Vehicle'} 
                                    trigger={
                                        <IconTrash 
                                            className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' 
                                            size={'25'} 
                                            onClick={() => handleDelete(item.id, item.name)}
                                        />
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