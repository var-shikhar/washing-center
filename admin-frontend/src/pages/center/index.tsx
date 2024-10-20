import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useCenterPanel from '@/hooks/users/use-center-panel'
import { useState } from 'react'
import CenterList from './component/centerList'

const filterType = [
  {slug: 'pending', label: 'Pending Centers'},
  {slug: 'live', label: 'Live Centers'},
]

export default function CenterPanel() {
  const { filteredOBJ, searchTerm, modalToggle, setSearchTerm, setModalToggle, handleCenterActiveStatus, handleCenterListingStatus, handleCenterDeletion } = useCenterPanel();
  const [activeType, setActiveType] = useState(filterType[0].slug)

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
          <h1 className='text-2xl font-bold tracking-tight'>Center List</h1>
          <p className='text-muted-foreground'>View and manage all your centers at one place.</p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <Input
            placeholder='Filter services...'
            className='h-9 w-40 lg:w-[250px]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex gap-2 items-center my-1 sm:my-3 justify-center sm:justify-start'>
          {filterType?.map(item => 
            <div 
              key={item.slug}  
              onClick={() => {
                setActiveType(item.slug);
                setSearchTerm('')
              }}
              className={`cursor-pointer p-2 font-semibold rounded transition ${activeType === item.slug ? 'bg-[--greenish-blue] text-slate-200' : 'border border-[--greenish-blue] text-[--greenish-blue]'}`}
            >
              {item.label}
            </div>
          )}
        </div>
        <Separator className='shadow' />
        {activeType === filterType[0].slug 
          ? <CenterList list={filteredOBJ.unListedCenterList} type={"pending"} toggle={modalToggle} setToggle={setModalToggle} handleCenterStatus={(centerID: string) => handleCenterActiveStatus(centerID)} handleCenterLiveMode={(centerID: string) => handleCenterListingStatus(centerID)} handleDeletion={(centerID: string) => handleCenterDeletion(centerID)} />
          : <CenterList list={filteredOBJ.centerList} type={"live"} toggle={modalToggle} setToggle={setModalToggle} handleCenterStatus={(centerID: string) => handleCenterActiveStatus(centerID)} handleCenterLiveMode={(centerID: string) => handleCenterListingStatus(centerID)} handleDeletion={(centerID: string) => handleCenterDeletion(centerID)} />
        }
      </Layout.Body>
    </Layout>
  )
}