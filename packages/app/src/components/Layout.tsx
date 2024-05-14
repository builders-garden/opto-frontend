import React, { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout(props: PropsWithChildren) {
  return (
    <div className='flex flex-col bg-neutral min-h-screen'>
            <Footer />
      <Header />

      <main className='flex-grow px-4 container  max-w-6xl mx-auto'>{props.children}</main>

    </div>
  )
}
