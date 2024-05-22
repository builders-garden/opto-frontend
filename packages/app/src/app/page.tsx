import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/site'
import { EXAMPLE_ITEMS } from './pages/examples'
import opto from '@/assets/icons/opto.png'

import chainlink from '@/assets/chainlink.png'
import graph from '@/assets/graph.png'
import blockmagic from '@/assets/blockmagic.png'
import polygon from '@/assets/polygon.png'
export default function Home() {
  return (
    <>
      <div className="absolute -mt-10 bg-primary/[0.6] left-64 top-1/3 px-8 py-8 rounded-xl">

        <div className="flex items-center">
          <img className="w-36 mr-8 mb-4 opacity-100" src={opto.src} alt="Opto Logo" />
          <div>
            <h2 className='text-8xl font-mono'>OPTO DEX</h2>
            <h2 className='text-2xl font-mono mb-2'>Cash-settled derivate option market</h2>

          </div>
        </div>

        <div className="flex -ml-2 mt-20 flex-col items-center">
          <h2 className='text-2xl font-mono mb-2'>Built by two builders during</h2>
          <img className="mb-4 opacity-100" src={blockmagic.src} alt="Opto Logo" />
        </div>



      </div>


      <div className="absolute mt-4 bg-primary/[0.6] right-64 top-1/3 px-8 py-8 items-center justify-center rounded-xl">
        <h2 className='text-2xl font-mono mb-2'>Powered by</h2>
        <div className="flex flex-col items-center">
          <img className="h-20 mb-4 mt-2 opacity-100" src={chainlink.src} alt="Opto Logo" />
          <img className="h-12 mb-4 mt-2 opacity-100" src={polygon.src} alt="Opto Logo" />
          <img className="h-16 mb-4 mt-2 opacity-100" src={graph.src} alt="Opto Logo" />
        </div>
      </div>


    </>
  )
}