
import React from 'react'
import Footer from '../../components/shared/footer/Footer'
import Header from '../../components/shared/header/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header/>
      
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  )
}