import { Button } from '@/components/custom/button'
import CustomTooltip from '@/components/custom/customTooltip'
import ThemeSwitch from '@/components/theme-switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useCenter from '@/hooks/center/use-center'
import {
  IconAdjustmentsHorizontal,
  IconEdit,
  IconListDetails,
  IconLock,
  IconLockOpenOff,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconTrash,
} from '@tabler/icons-react'
import CenterRegistrationForm from './component/centerForm'

export default function CenterPanel() {
  const {filteredList, handleConfirmation, modalToggle, searchTerm, selectedSort, setModalToggle, setSearchTerm, setSelectedSort, modalData, setModalData, handleCenterDeletion, handleCenterStatusUpdate, handleCenterSelectionFunction } = useCenter();


  function handleCenterForm(id: string, title: string){
    setModalToggle(true);
    setModalData({id: id, title: title});
  }

  // console.log(filteredList)

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
            Center List
          </h1>
          <p className='text-muted-foreground'>
            View and manage your center at one place.
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter centers...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className='w-16'>
                <SelectValue>
                  <IconAdjustmentsHorizontal size={18} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent align='end'>
                <SelectItem value='ascending'>
                  <div className='flex items-center gap-4'>
                    <IconSortAscendingLetters size={16} />
                    <span>Ascending</span>
                  </div>
                </SelectItem>
                <SelectItem value='descending'>
                  <div className='flex items-center gap-4'>
                    <IconSortDescendingLetters size={16} />
                    <span>Descending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={modalToggle} onOpenChange={setModalToggle}>
            <DialogTrigger asChild>
              <Button type='button' onClick={() => handleCenterForm('', 'Add New Center')}>Add New Center</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50vw]">
              <DialogHeader>
                <DialogTitle>{modalData.title}</DialogTitle>
              </DialogHeader> 
              <CenterRegistrationForm 
                formID={modalData.id} 
                handleConfirmation={() => {
                  handleConfirmation()
                  setModalToggle(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Separator className='shadow' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredList.map((center) => (
            <li
              key={center.centerID}
              className='relative rounded-lg border p-4 hover:shadow-md'
            >
              {!center.centerIsActive && <div className='absolute bg-red-500 text-white px-3 rounded-e-md top-0 left-0'>Activate Center</div>}
              <div className='my-2 mt-3 flex items-center justify-between'>
                <div className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2 font-bold`}>
                  {center?.centerAbbreviation}
                </div>
                <div className='flex gap-2'>
                  <CustomTooltip 
                    content={'Edit Center Details'} 
                    trigger={
                      <IconEdit className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleCenterForm(center.centerID, 'Edit Center Details')} />
                    }
                  />
                  <CustomTooltip 
                    content={center.centerIsActive ? 'InActivate Center' : 'Activate Center'} 
                    trigger={
                      center.centerIsActive 
                        ? <IconLock className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleCenterStatusUpdate(center.centerID, !center.centerIsActive)} />
                        : <IconLockOpenOff className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleCenterStatusUpdate(center.centerID, !center.centerIsActive)} />
                    }
                  />
                  <CustomTooltip 
                    content={'Delete Center'} 
                    trigger={
                      <IconTrash className='cursor-pointer rounded-md border p-1 bg-slate-400 hover:bg-slate-600 transition-all fade-in-100 text-black hover:text-white' size={'25'} onClick={() => handleCenterDeletion(center.centerID)} />
                    }
                  />
                </div>
              </div>
              <div>
                <h2 className='mb-1 font-semibold text-xl'>{center.centerName}</h2>
                <p className='line-clamp-2 text-gray-900'>Phone: {center.centerPhone}</p>
                <small className='line-clamp-2 text-gray-500'>{center.centerAddress}</small>
                <Button 
                  className='my-2 flex gap-2' 
                  size={'sm'} 
                  variant={'outline'} 
                  onClick={() => handleCenterSelectionFunction(center.centerID)}
                >
                  <IconListDetails size={15} /> View Details
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Layout.Body>
    </Layout>
  )
}