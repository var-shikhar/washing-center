import { Button } from '@/components/custom/button'
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
import useService from '@/hooks/service/use-service'
import {
    IconAdjustmentsHorizontal,
    IconSortAscendingLetters,
    IconSortDescendingLetters
} from '@tabler/icons-react'
import BookingList from './component/bookingList'

export default function AdminBookingPanel() {
  const { filteredList, handleConfirmation, modalToggle, searchTerm, selectedSort, setModalToggle, setSearchTerm, setSelectedSort, modalData, setModalData, handleServiceDeletion, handleServiceStatusUpdate } = useService();

  function handleCenterForm(id: string, title: string){
    setModalToggle(true);
    setModalData({id: id, title: title});
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
          <h1 className='text-2xl font-bold tracking-tight'>
            Service List
          </h1>
          <p className='text-muted-foreground'>
            View and manage all your services at one place.
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter services...'
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
              <Button type='button' onClick={() => handleCenterForm('', 'Add New Service')}>Add New Service</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50vw]">
              <DialogHeader>
                <DialogTitle>{modalData.title}</DialogTitle>
              </DialogHeader> 
              {/* <ServiceForm 
                formID={modalData.id} 
                handleConfirmation={() => {
                  handleConfirmation()
                  setModalToggle(false)
                }}
              /> */}
            </DialogContent>
          </Dialog>
        </div>
        <Separator className='shadow' />
        <BookingList list={filteredList} handleDelete={handleServiceDeletion} handleUpdate={handleServiceStatusUpdate} handleEdit={handleCenterForm} />
      </Layout.Body>
    </Layout>
  )
}