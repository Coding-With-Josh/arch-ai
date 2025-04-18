import React from 'react'
import { Button } from '../ui/button'

export const Hero = () => {
  return (
    <div className="px-10 mt-[8rem] flex w-full items-start justify-start flex-col gap-2">
        <div className='flex w-full items-start justify-center my-4 flex-col text-9xl font-extrabold text-transparent'>
            <h2 className='bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400/90 bg-clip-text text-clip'>Build.</h2>
            <h2 className='bg-gradient-to-r from-indigo-100 via-indigo-300/80 to-indigo-500/80 bg-clip-text text-clip'>Ship.</h2>
            <h2 className='bg-gradient-to-r from-zinc-100 via-green-300/80 to-green-500/80 bg-clip-text text-clip'>Scale.</h2>
        </div>
        <p className="text-sm text-zinc-400">The world's first multi-ecosystem multi-chain tool for developers.<br/> The ideal tool to build, from ideation to deployment.</p>
  <Button className='mt-4'>Launch Arch</Button>
    </div>
  )
}
