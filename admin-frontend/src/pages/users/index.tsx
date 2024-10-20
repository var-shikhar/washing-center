import ThemeSwitch from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UserNav } from '@/components/user-nav'
import { Layout } from '@/context/layout'
import useUserPanel from '@/hooks/users/use-user-panel'
import UserList from './component/userList'

export default function AdminBookingPanel() {
  const { filteredList, searchTerm, modalToggle, setModalToggle, setSearchTerm, handleUserDeletion } = useUserPanel();

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
          <h1 className='text-2xl font-bold tracking-tight'>Partner Panel</h1>
          <p className='text-muted-foreground'>View and manage all your center partners at one place.</p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex gap-4 sm:my-4'>
            <Input
              placeholder='Filter partner by name...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Separator className='shadow' />
        <UserList list={filteredList} toggle={modalToggle} setToggle={setModalToggle} handleDeletion={(partnerID: string) => handleUserDeletion(partnerID)} />
      </Layout.Body>
    </Layout>
  )
}