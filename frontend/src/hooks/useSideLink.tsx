import { useUserContext } from '@/context/userContext'
import {
  IconBuildingWarehouse,
  IconChecklist,
  IconLayoutDashboard,
  IconShoppingBag,
  IconSitemapFilled
} from '@tabler/icons-react'

export interface INavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface ISideLink extends INavLink {
  sub?: INavLink[]
}

export default function useSideLinks () {
  const { selectedCenter, userData } = useUserContext();
  const centerSideLinks: ISideLink[] = [
    {
      title: 'Dashboard',
      label: '',
      href: '/dashboard',
      icon: <IconLayoutDashboard size={18} />,
    },
    {
      title: 'Booking Requests',
      label: '',
      href: '/bookings',
      icon: <IconShoppingBag size={18} />,
    },
    {
      title: 'Service List',
      label: '',
      href: '/services',
      icon: <IconChecklist size={18} />,
    },
  ]
  const adminSideLinks: ISideLink[] = [
    // {
    //   title: 'Dashboard',
    //   label: '',
    //   href: '/dashboard',
    //   icon: <IconLayoutDashboard size={18} />,
    // },
    {
      title: 'Center List',
      label: '',
      href: '/center',
      icon: <IconBuildingWarehouse size={18} />,
    },
    {
      title: 'Team List',
      label: '',
      href: '/team',
      icon: <IconSitemapFilled size={18} />,
    },
  ]

  const clientSideLinks: ISideLink[] = [
    {
      title: 'Bookings',
      label: '',
      href: '/dashboard',
      icon: <IconBuildingWarehouse size={18} />,
    },
    {
      title: 'Find More Centers',
      label: '',
      href: '/',
      icon: <IconLayoutDashboard size={18} />,
    },
  ]

  const sidelinks = userData?.userRole === 'Client' ? clientSideLinks : selectedCenter !== null ? centerSideLinks : adminSideLinks

  return {
    sidelinks
  }

}