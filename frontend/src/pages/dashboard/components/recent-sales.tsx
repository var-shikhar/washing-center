import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentSales() {
  return (
    <div className='space-y-8'>
      <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>RC</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Rohan Choudhary</p>
          <p className='text-sm text-muted-foreground'>
            guptarohan434@gmail.com
          </p>
        </div>
        <div className='ml-auto font-medium'>+₹ 500.00</div>
      </div>
      <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>RC</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Rohan Choudhary</p>
          <p className='text-sm text-muted-foreground'>
            guptarohan434@gmail.com
          </p>
        </div>
        <div className='ml-auto font-medium'>+₹ 500.00</div>
      </div><div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>RC</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Rohan Choudhary</p>
          <p className='text-sm text-muted-foreground'>
            guptarohan434@gmail.com
          </p>
        </div>
        <div className='ml-auto font-medium'>+₹ 500.00</div>
      </div>
    </div>
  )
}
