import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TDashboardData } from '@/hooks/use-admin-dashboard'

type RecentSalesProps = {
  list: TDashboardData['bookingList']
}

export function RecentSales({list}: RecentSalesProps) {
  return (
    <div className='space-y-8'>
      {list?.map(item => (
        <div className='flex items-center' key={item.id}>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/01.png' alt='Avatar' />
            <AvatarFallback>{item.abbreviation}</AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{item.serviceName}</p>
            <p className='text-sm text-muted-foreground'>{item.clientName}</p>
          </div>
          <div className='ml-auto font-medium'>+₹ {item.serviceAmount}</div>
        </div>
      ))}
    </div>
  )
}
