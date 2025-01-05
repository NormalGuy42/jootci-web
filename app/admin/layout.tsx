import React from 'react'
import UserPageLayout from '../../components/shared/userpage/user-layout'
import { OrdersIcon, ProfileIcon, HomeIcon, GridIcon, AppleIcon, SettingsIcon, ShieldIcon } from '../../components/icons/Icons'


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const links = [
    {
      title: 'Overview',
      href: '/admin/overview',
      icon: <HomeIcon/>
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: <GridIcon/>
    },
    {
      title: 'Products',
      href: '/admin/products',
      icon: <AppleIcon/>
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: <OrdersIcon/>
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <ProfileIcon/>
    },
    {
      title: 'Verifications',
      href: '/admin/verification',
      icon: <ShieldIcon/>
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <SettingsIcon/>
    },
  ]
  
  return (
    <UserPageLayout links={links}>
      {children}
    </UserPageLayout>
  )
}