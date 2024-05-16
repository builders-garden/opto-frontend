import React from 'react'
import { LinkComponent } from './LinkComponent'
import { SITE_EMOJI } from '@/utils/site'
import { Connect } from './Connect'
import Opto from '@/assets/icons/opto.png'

export function Header() {
  return (
    <header className='navbar sticky top-[0vh] z-20 border-solid border-bottom border-indigo-400 flex justify-between p-8 pt-0 pb-0 bg-primary text-neutral-content shadow-lg'>
      <div className='flex-grow px-4  max-w-6xl mx-auto'>



        <LinkComponent href='/'>
        <img className="w-12 ml-4  opacity-100 " src={Opto.src} alt="Opto Logo" />
        </LinkComponent>
        <div className='flex gap-5 items-center mx-auto'>
        <div className='flex gap-5 items-center'></div>
        <LinkComponent href='/pages/explore'>
          <h1 className='text-xl font-bold'>Explorer</h1>
        </LinkComponent>
        <LinkComponent href='/pages/dashboard'>
          <h1 className='text-xl font-bold'>Dashboard</h1>
        </LinkComponent>
      </div>

      <div className='flex gap-4 items-center'>
        <Connect />
      </div>
      </div>
    </header>
  )
}
