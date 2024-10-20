import { Button } from '@/components/custom/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useUserContext } from '@/context/userContext'
import useAxioRequests from '@/lib/axioRequest'
import ROUTES from '@/lib/routes'
import { useNavigate } from 'react-router-dom'
import commonFn from '@/lib/commonFn'

const { getNameAbbreviation } = commonFn

export function UserNav() {
  const navigate = useNavigate();
  const { HandleGetRequest } = useAxioRequests();
  const { handleLoggedOut, userData } = useUserContext();
  async function handleLogout() {
    const response = await HandleGetRequest({
      route: ROUTES.getLogoutRoute, 
    })
    if(response?.status === 200){
      handleLoggedOut();
      navigate('../');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@washing-center' />
            <AvatarFallback>{getNameAbbreviation(userData?.userName ?? 'User')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{userData?.userName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {userData?.userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> 
        <DropdownMenuSeparator />*/}
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
