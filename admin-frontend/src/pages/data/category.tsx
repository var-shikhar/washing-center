import { Button } from '@/components/custom/button'
import CustomDialog from '@/components/custom/customDialog'
import CustomTooltip from '@/components/custom/customTooltip'
import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useCategoryPanel from '@/hooks/data/use-category-panel'
import { TServiceCategory } from '@/lib/commonTypes'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { startTransition, useState } from 'react'
import CategoryForm from './form/categoryForm'

export default function CategoryPanel() {
    const { filteredList, modalToggle, searchTerm, setSearchTerm, setModalToggle, handleCategoryDeletion, handleConfirmation } = useCategoryPanel();
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
                <h1 className='text-2xl font-bold tracking-tight'>Category List Panel</h1>
                <p className='text-muted-foreground'>View and create all your category at one place.</p>
                </div>
                <div className='my-4 flex items-end justify-between sm:items-center'>
                    <Input
                        placeholder='Filter category by name...'
                        className='h-9 w-40 lg:w-[250px]'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type='button' onClick={() => handleListAction('', '', 'Add New Category', 'Add')}>Add New Category</Button>
                </div>
                <Separator className='shadow' />
                <CategoryList 
                    list={filteredList} 
                    handleDelete={(categoryID: string, name: string) => handleListAction(categoryID, name, 'Delete Category', 'Delete')} 
                    handleEdit={(categoryID: string, name: string) => handleListAction(categoryID, name, 'Edit Category', 'Edit')} />
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
                                        <Button type='button' onClick={() =>  handleCategoryDeletion(selectedID.id)}>Delete Category</Button>
                                    </div>
                                </div>
                            : <CategoryForm formID={selectedID.id} handleConfirmation={handleConfirmation} /> }
                        </div>
                    }
                />                
            </Layout.Body>
        </Layout>
    )
}

type TCategoryListProps = {
    list: TServiceCategory[];
    handleDelete: (categoryID: string, name: string) => void;
    handleEdit: (categoryID: string, name: string) => void;
}

const CategoryList = ({ list, handleEdit, handleDelete } :TCategoryListProps) => {
    return (
        <div className='overflow-x-auto overscroll-y-none'>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-2 rounded-s py-3 font-bold text-xs text-white bg-black uppercase tracking-wider md:px-6 text-center">S.No.</th>
                    <th className='px-2 py-3 bg-black'><div className="text-left font-bold text-xs text-white  uppercase tracking-wider w-max">Category Name</div></th>
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