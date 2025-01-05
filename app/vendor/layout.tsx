import Link from 'next/link'
import React from 'react'
import { Menu } from '../../components/shared/header/menu'
import UserPageLayout from '../../components/shared/userpage/user-layout'
import { AppleIcon, HomeIcon, OrdersIcon, SettingsIcon } from '../../components/icons/Icons'


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const links = [
    {
      title: 'Overview',
      href: '/vendor/overview',
      icon: <HomeIcon/>
    },
    {
      title: 'Products',
      href: '/vendor/products',
      icon: <AppleIcon/>
    },
    {
      title: 'Orders',
      href: '/vendor/orders',
      icon: <OrdersIcon/>
    },
    {
      title: 'Settings',
      href: '/vendor/settings',
      icon: <SettingsIcon/>
    },
  ]

  return (
    <UserPageLayout links={links}>
      {children}
    </UserPageLayout>
  )
}