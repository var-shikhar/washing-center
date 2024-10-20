import {
  IconChecklist,
  IconLayoutDashboard,
  IconShoppingBag
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
  const sidelinks: ISideLink[] = [
    {
      title: 'Dashboard',
      label: '',
      href: '/dashboard',
      icon: <IconLayoutDashboard size={18} />,
    },
    {
      title: 'User Panel',
      label: '',
      href: '/users',
      icon: <IconShoppingBag size={18} />,
    },
    {
      title: 'Centers',
      label: '',
      href: '/centers',
      icon: <IconShoppingBag size={18} />,
    },
    {
      title: 'Settings',
      label: '',
      href: '/setting',
      icon: <IconChecklist size={18} />,
      sub: [
        {
          title: 'Services',
          label: '',
          href: '/setting/service',
          icon: <IconShoppingBag size={18} />,
        },
        {
          title: 'Category',
          label: '',
          href: '/setting/category',
          icon: <IconShoppingBag size={18} />,
        },
        {
          title: 'Vehicle',
          label: '',
          href: '/setting/vehicle',
          icon: <IconShoppingBag size={18} />,
        },
      ]
    },
  ]
 
  return {
    sidelinks
  }

}